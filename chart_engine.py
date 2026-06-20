"""
Sidereal (Vedic) chart engine using Skyfield + JPL DE421.
Lahiri (Chitrapaksha) ayanamsa. Whole-sign houses. Mean lunar node (Rahu).
"""
import math
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
# Vimshottari lords by nakshatra index (0-26)
NAK_LORD = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury']*3
DASHA_YEARS = {'Ketu':7,'Venus':20,'Sun':6,'Moon':10,'Mars':7,
               'Rahu':18,'Jupiter':16,'Saturn':19,'Mercury':17}
DASHA_SEQ = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury']

def lahiri_ayanamsa(jd):
    # Chitrapaksha/Lahiri: 23.85254 deg at J2000.0, rate 50.2876"/yr
    T = (jd - 2451545.0) / 365.25
    return 23.85254 + (50.2876/3600.0)*T

def mean_obliquity(jd):
    T = (jd - 2451545.0)/36525.0
    return 23.439291 - 0.0130042*T - 1.64e-7*T*T + 5.04e-7*T*T*T

def mean_node(jd):
    T = (jd - 2451545.0)/36525.0
    om = 125.04452 - 1934.136261*T + 0.0020708*T*T + (T**3)/450000.0
    return om % 360.0

def norm(x): return x % 360.0

def sign_of(lon):
    s = int(lon//30); return s, SIGNS[s], lon-30*s

def nak_of(lon):
    n = int(lon // (360/27))
    pada = int((lon % (360/27)) // (360/27/4)) + 1
    return n, NAK[n], pada, NAK_LORD[n]

PLANETS = {
    'Sun':'sun','Moon':'moon','Mercury':'mercury','Venus':'venus',
    'Mars':'mars','Jupiter':'jupiter barycenter','Saturn':'saturn barycenter'}

def sidereal_positions(t, jd):
    ay = lahiri_ayanamsa(jd)
    out = {}
    obs = earth.at(t)
    for name, key in PLANETS.items():
        lat, lon, dist = obs.observe(eph[key]).apparent().ecliptic_latlon()
        out[name] = norm(lon.degrees - ay)
    rahu = norm(mean_node(jd) - ay)
    out['Rahu'] = rahu
    out['Ketu'] = norm(rahu+180)
    return out, ay

def is_retro(name, t, jd):
    if name in ('Sun','Moon','Rahu','Ketu'): return name in ('Rahu','Ketu')
    dt = 0.5
    t2 = ts.tt_jd(t.tt + dt)
    l1 = earth.at(t).observe(eph[PLANETS[name]]).apparent().ecliptic_latlon()[1].degrees
    l2 = earth.at(t2).observe(eph[PLANETS[name]]).apparent().ecliptic_latlon()[1].degrees
    d = (l2-l1+540)%360-180
    return d < 0

def ascendant(jd, lat, lon_east):
    t = ts.tt_jd(jd_to_tt(jd))
    gast = t.gast  # hours
    lst = (gast*15 + lon_east) % 360  # degrees (RAMC)
    eps = math.radians(mean_obliquity(jd))
    ramc = math.radians(lst)
    phi = math.radians(lat)
    asc = math.atan2(math.cos(ramc),
                     -(math.sin(ramc)*math.cos(eps) + math.tan(phi)*math.sin(eps)))
    asc = math.degrees(asc) % 360
    return norm(asc - lahiri_ayanamsa(jd))

# crude TT~UT for this era (deltaT ~64s in 1999) handled by skyfield when using utc;
# we pass jd as TT-based via ts directly below instead.
def jd_to_tt(jd): return jd

def chart(year, month, day, hour_ist, minute_ist, lat, lon_east, tz=5.5):
    # convert IST -> UTC
    ut_hour = hour_ist + minute_ist/60.0 - tz
    t = ts.utc(year, month, day, 0, 0, 0)
    t = ts.utc(year, month, day, int(ut_hour) if ut_hour>=0 else int(ut_hour), 0, 0)
    # build precise time
    t = ts.utc(year, month, day, 0, 0, (ut_hour*3600))
    jd_tt = t.tt
    pos, ay = sidereal_positions(t, t.tt)
    asc = ascendant_from_t(t, lat, lon_east)
    return t, pos, asc, ay

def ascendant_from_t(t, lat, lon_east):
    jd = t.tt
    gast = t.gast
    lst = (gast*15 + lon_east) % 360
    eps = math.radians(mean_obliquity(jd))
    ramc = math.radians(lst); phi = math.radians(lat)
    asc = math.degrees(math.atan2(math.cos(ramc),
            -(math.sin(ramc)*math.cos(eps)+math.tan(phi)*math.sin(eps)))) % 360
    return norm(asc - lahiri_ayanamsa(jd))

def describe(lon):
    si, sn, deg = sign_of(lon)
    ni, nn, pada, nl = nak_of(lon)
    return f"{sn} {deg:5.2f}  | {nn} pada {pada} (lord {nl})"

if __name__ == '__main__':
    LAT, LON = 22.136650, 84.504267  # Rourkela (east positive)
    for label,(hh,mm) in {'00:16 (decimal 0.27h)':(0,16),'00:27 (HH.MM 0.27)':(0,27)}.items():
        t, pos, asc, ay = chart(1999,1,3,hh,mm,LAT,LON)
        print('='*70)
        print(f"Birth time {label}  |  ayanamsa {ay:.4f}")
        print(f"  Lagna(Asc): {describe(asc)}")
        print(f"  Moon      : {describe(pos['Moon'])}")
        print(f"  Sun       : {describe(pos['Sun'])}")
