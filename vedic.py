"""
Full sidereal Vedic chart + Vimshottari dasha + 2026 transits.
Skyfield + JPL DE421, Lahiri ayanamsa, whole-sign houses, mean node (Rahu).
Outputs a JSON blob consumed by the report/PDF builder.
"""
import math, json, datetime as dt
from skyfield.api import load

ts = load.timescale()
eph = load('de421.bsp')
earth = eph['earth']

SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra',
         'Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
SIGN_LORD = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus',
             'Mars','Jupiter','Saturn','Saturn','Jupiter']
NAK = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu',
       'Pushya','Ashlesha','Magha','P.Phalguni','U.Phalguni','Hasta','Chitra',
       'Swati','Vishakha','Anuradha','Jyeshtha','Mula','P.Ashadha','U.Ashadha',
       'Shravana','Dhanishta','Shatabhisha','P.Bhadra','U.Bhadra','Revati']
NAK_LORD = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury']*3
DY = {'Ketu':7,'Venus':20,'Sun':6,'Moon':10,'Mars':7,'Rahu':18,'Jupiter':16,'Saturn':19,'Mercury':17}
SEQ = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury']
PLANETS = {'Sun':'sun','Moon':'moon','Mercury':'mercury','Venus':'venus',
           'Mars':'mars','Jupiter':'jupiter barycenter','Saturn':'saturn barycenter'}
EXALT = {'Sun':0,'Moon':30,'Mars':270,'Mercury':150,'Jupiter':90,'Venus':330,'Saturn':180}  # deg of exaltation
OWN = {'Sun':[4],'Moon':[3],'Mars':[0,7],'Mercury':[2,5],'Jupiter':[8,11],'Venus':[1,6],'Saturn':[9,10]}
MOOL = {'Sun':4,'Moon':1,'Mars':0,'Mercury':5,'Jupiter':8,'Venus':6,'Saturn':10}
COMBUST = {'Moon':12,'Mars':17,'Mercury':14,'Venus':10,'Jupiter':11,'Saturn':15}

def norm(x): return x % 360.0
def lahiri(jd):
    T=(jd-2451545.0)/365.25
    return 23.85254+(50.2876/3600.0)*T
def mean_obl(jd):
    T=(jd-2451545.0)/36525.0
    return 23.439291-0.0130042*T-1.64e-7*T*T+5.04e-7*T*T*T
def mean_node(jd):
    T=(jd-2451545.0)/36525.0
    return (125.04452-1934.136261*T+0.0020708*T*T+(T**3)/450000.0)%360.0
def sign_of(l):
    s=int(l//30); return s,SIGNS[s],l-30*s
def nak_of(l):
    span=360/27; n=int(l//span); pada=int((l%span)//(span/4))+1
    return n,NAK[n],pada,NAK_LORD[n]
def navamsa_sign(l): return int(l//(10/3))%12
def dasamsa_sign(l):
    s=int(l//30); p=int((l%30)//3)
    start=s if s%2==0 else (s+8)%12   # odd sign(1st=Aries idx0 is "odd" rasi) -> rasi number odd
    # Vedic: odd rasi (Aries=1) start same; even rasi start 9th. idx0=Aries=odd.
    start = s if (s%2==0) else (s+8)%12
    return (start+p)%12

def t_from_ist(y,mo,d,hh,mm,tz=5.5):
    ut=hh+mm/60.0-tz
    return ts.utc(y,mo,d,0,0,ut*3600)

def positions(t):
    jd=t.tt; ay=lahiri(jd); obs=earth.at(t); out={}
    for nm,key in PLANETS.items():
        lon=obs.observe(eph[key]).apparent().ecliptic_latlon()[1].degrees
        out[nm]=norm(lon-ay)
    r=norm(mean_node(jd)-ay); out['Rahu']=r; out['Ketu']=norm(r+180)
    return out,ay

def retro(nm,t):
    if nm in('Sun','Moon'):return False
    if nm in('Rahu','Ketu'):return True
    t2=ts.tt_jd(t.tt+0.6)
    l1=earth.at(t).observe(eph[PLANETS[nm]]).apparent().ecliptic_latlon()[1].degrees
    l2=earth.at(t2).observe(eph[PLANETS[nm]]).apparent().ecliptic_latlon()[1].degrees
    return bool(((l2-l1+540)%360-180)<0)

def ascendant(t,lat,lon_e):
    jd=t.tt; lst=(t.gast*15+lon_e)%360
    eps=math.radians(mean_obl(jd)); ramc=math.radians(lst); phi=math.radians(lat)
    a=math.degrees(math.atan2(math.cos(ramc),
        -(math.sin(ramc)*math.cos(eps)+math.tan(phi)*math.sin(eps))))%360
    return norm(a-lahiri(jd))

def dignity(nm,lon):
    s,_,deg=sign_of(lon)
    if nm in EXALT:
        ex=EXALT[nm]; deb=(ex+180)%360
        if abs((lon-ex+180)%360-180)<1.0 or int(ex//30)==s:
            if int(ex//30)==s:
                pass
    res=[]
    if nm in EXALT and int(EXALT[nm]//30)==s: res.append('Exalted')
    if nm in EXALT and int(((EXALT[nm]+180)%360)//30)==s: res.append('Debilitated')
    if nm in OWN and s in OWN[nm]: res.append('Own sign')
    if nm in MOOL and MOOL[nm]==s and deg<( 'x' and 30):
        pass
    return res

def combust(nm,lon,sunlon):
    if nm not in COMBUST: return False
    d=abs((lon-sunlon+180)%360-180)
    return bool(d<COMBUST[nm])

def build_natal(y,mo,d,hh,mm,lat,lon_e):
    t=t_from_ist(y,mo,d,hh,mm)
    pos,ay=positions(t)
    asc=ascendant(t,lat,lon_e)
    lagna_sign=int(asc//30)
    sunlon=pos['Sun']
    planets={}
    for nm,lon in pos.items():
        s,sn,deg=sign_of(lon)
        ni,nn,pada,nl=nak_of(lon)
        house=((s-lagna_sign)%12)+1
        dig=dignity(nm,lon)
        planets[nm]=dict(lon=round(lon,3),sign=sn,deg=round(deg,2),
            nak=nn,pada=pada,naklord=nl,house=house,
            retro=retro(nm,t),combust=combust(nm,lon,sunlon),dignity=dig,
            d9=SIGNS[navamsa_sign(lon)],d10=SIGNS[dasamsa_sign(lon)])
    ls,lsn,ldeg=sign_of(asc); lni,lnn,lpada,lnl=nak_of(asc)
    natal=dict(ayanamsa=round(ay,4),
        lagna=dict(lon=round(asc,3),sign=lsn,deg=round(ldeg,2),nak=lnn,pada=lpada,
                   naklord=lnl,lord=SIGN_LORD[ls],d9=SIGNS[navamsa_sign(asc)],
                   d10=SIGNS[dasamsa_sign(asc)]),
        planets=planets, lagna_sign=lagna_sign)
    return natal,pos,t

# ---------- Vimshottari ----------
def vimshottari(moonlon, birth_dt):
    span=360/27; n=int(moonlon//span); lord=NAK_LORD[n]
    frac=(moonlon%span)/span
    bal=DY[lord]*(1-frac)
    seq=[]; i=SEQ.index(lord); cur=birth_dt
    # first MD partial
    md=[]; durs=[]
    md.append((lord,bal));
    for k in range(1,9):
        l=SEQ[(i+k)%9]; md.append((l,DY[l]))
    # extend a few more cycles
    for k in range(9,18):
        l=SEQ[(i+k)%9]; md.append((l,DY[l]))
    out=[]
    for lord_md,years in md:
        start=cur; end=cur+dt.timedelta(days=years*365.25)
        out.append(dict(lord=lord_md,start=start,end=end,years=years))
        cur=end
    return out

def antardashas(md_lord, md_start, md_years):
    i=SEQ.index(md_lord); res=[]; cur=md_start
    for k in range(9):
        l=SEQ[(i+k)%9]; dur=md_years*DY[l]/120.0
        s=cur; e=cur+dt.timedelta(days=dur*365.25)
        res.append(dict(lord=l,start=s,end=e,years=dur)); cur=e
    return res

def pratyantar(ad_lord, ad_start, ad_years):
    i=SEQ.index(ad_lord); res=[]; cur=ad_start
    for k in range(9):
        l=SEQ[(i+k)%9]; dur=ad_years*DY[l]/120.0
        s=cur; e=cur+dt.timedelta(days=dur*365.25)
        res.append(dict(lord=l,start=s,end=e,years=dur)); cur=e
    return res

def transits_2026():
    months=[]
    for mo in range(1,13):
        t=ts.utc(2026,mo,15,12,0,0)
        pos,_=positions(t)
        rr={nm:retro(nm,t) for nm in PLANETS}
        months.append(dict(month=mo,pos={k:round(v,2) for k,v in pos.items()},
                           signs={k:SIGNS[int(v//30)] for k,v in pos.items()},
                           retro=rr))
    return months

if __name__=='__main__':
    LAT,LON=22.136650,84.504267
    natal,pos,t=build_natal(1999,1,3,0,27,LAT,LON)
    birth_dt=dt.datetime(1999,1,3,0,27)
    md=vimshottari(pos['Moon'],birth_dt)
    data=dict(natal=natal, md=[dict(lord=m['lord'],
              start=m['start'].strftime('%Y-%m-%d'),end=m['end'].strftime('%Y-%m-%d'),
              years=round(m['years'],3)) for m in md])
    # find current MD (2026) and expand AD/PD
    target=dt.datetime(2026,1,1)
    detail=[]
    for m in md:
        if m['end']<dt.datetime(2024,1,1) or m['start']>dt.datetime(2028,1,1): continue
        ads=antardashas(m['lord'],m['start'],m['years'])
        adl=[]
        for a in ads:
            if a['end']<dt.datetime(2025,1,1) or a['start']>dt.datetime(2028,1,1): continue
            pds=pratyantar(a['lord'],a['start'],a['years'])
            pdl=[dict(lord=p['lord'],start=p['start'].strftime('%Y-%m-%d'),
                 end=p['end'].strftime('%Y-%m-%d')) for p in pds
                 if not(p['end']<dt.datetime(2025,9,1) or p['start']>dt.datetime(2027,6,1))]
            adl.append(dict(lord=a['lord'],start=a['start'].strftime('%Y-%m-%d'),
                       end=a['end'].strftime('%Y-%m-%d'),prat=pdl))
        detail.append(dict(lord=m['lord'],start=m['start'].strftime('%Y-%m-%d'),
                      end=m['end'].strftime('%Y-%m-%d'),antar=adl))
    data['dasha_detail']=detail
    data['transits']=transits_2026()
    with open('chart_data.json','w') as f: json.dump(data,f,indent=2)
    # pretty print summary
    print("LAGNA:",natal['lagna'])
    print("\nPLANETS:")
    for nm in ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu']:
        p=natal['planets'][nm]
        flags=[]
        if p['retro']:flags.append('R')
        if p['combust']:flags.append('Cmb')
        flags+=p['dignity']
        print(f"  {nm:8} {p['sign']:11} {p['deg']:5.2f}  H{p['house']:<2} {p['nak']:11} p{p['pada']} (l:{p['naklord']:7}) D9:{p['d9']:9} D10:{p['d10']:9} {' '.join(flags)}")
    print("\nMAHADASHA timeline:")
    for m in data['md'][:8]:
        print(f"  {m['lord']:8} {m['start']} -> {m['end']}  ({m['years']}y)")
