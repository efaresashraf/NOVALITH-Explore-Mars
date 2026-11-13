import { useState } from 'react'
import { Activity, ArrowDownRight, ArrowUpRight, Bell, ChevronDown, ChevronLeft, ChevronRight, Compass, Crosshair, Download, ExternalLink, Eye, Filter, Gauge, Layers, Map, MapPin, Menu, Minus, MousePointer2, Navigation, Plus, Radio, Route, Search, Settings2, SlidersHorizontal, Sparkles, Target, Telescope, Thermometer, X } from 'lucide-react'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, ScaleControl, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const stops = [
  { id: 1, name: 'Jezero Crater', type: 'Landing site', lat: 18.4447, lon: 77.4508, color: '#ef7c52' },
  { id: 2, name: 'Delta Front', type: 'Sedimentary delta', lat: 18.47, lon: 77.51, color: '#e4bd79' },
  { id: 3, name: 'Shenandoah', type: 'Science target', lat: 18.40, lon: 77.58, color: '#83b9a4' },
]
const layerNames = ['CTX Imagery', 'HiRISE Imagery', 'MOLA Elevation']
const NASA_LAYERS = {
  'CTX Imagery': { url: 'https://astro.arcgis.com/arcgis/rest/services/OnMars/CTX/MapServer/tile/{z}/{y}/{x}', tileSize: 512, zoomOffset: -1, maxNativeZoom: 12, opacity: 0.72 },
  'HiRISE Imagery': { id: 'JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd', ext: 'png', tileSize: 256, maxNativeZoom: 17, opacity: 0.98 },
  'MOLA Elevation': { id: 'Mars_MGS_MOLA_ClrShade_merge_global_463m', ext: 'jpg', tileSize: 256, maxNativeZoom: 7, opacity: 0.9 },
}

function IllustratedMarsMap({ activeLayers, routeOn, onSelect }) {
  return <div className="map-canvas">
    <div className="map-grid" />
    <div className="coordinate coord-a">18° 26′ 41″ N<br/>77° 27′ 03″ E</div><div className="coordinate coord-b">18° 23′ 18″ N<br/>77° 22′ 54″ E</div>
    <div className="map-art" style={{ transform: `scale(${zoom})` }}>
      <svg className="terrain" viewBox="0 0 1000 650" preserveAspectRatio="xMidYMid slice" aria-label="Illustrated terrain map of Jezero Crater">
        <defs>
          <radialGradient id="mars" cx="48%" cy="48%" r="75%"><stop offset="0" stopColor="#b96c4c"/><stop offset=".45" stopColor="#95503f"/><stop offset="1" stopColor="#422d30"/></radialGradient>
          <pattern id="grain" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".7" fill="#f5c396" opacity=".18"/><circle cx="9" cy="8" r=".55" fill="#251f24" opacity=".4"/></pattern>
          <filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
        </defs>
        <rect width="1000" height="650" fill="#171a1d"/>
        <path d="M0 0h1000v650H0z" fill="url(#mars)"/>
        <path d="M15 120Q160 40 290 102T510 82q170-40 265 51t240 4v115q-130 15-203-20t-188 5q-160 61-290-16T0 253z" fill="#ba8060" opacity=".45"/>
        <path d="M-30 390q140-100 264-26t231 21q163-94 287-15t290-28v200q-130 57-260 25t-249 41q-175 38-290-32T-30 634z" fill="#563c38" opacity=".7"/>
        <ellipse cx="545" cy="315" rx="257" ry="178" fill="#443638" opacity=".8"/>
        <ellipse cx="545" cy="305" rx="224" ry="150" fill="#bd8060"/>
        <ellipse cx="545" cy="305" rx="200" ry="130" fill="#a96850"/>
        <path d="M354 276q50-96 155-90 78 3 123 70-45-32-95-28-74 2-183 48zm-4 61q91 42 182 13 76-22 136-2-77 100-196 84-69-9-122-95z" fill="#d09a70" opacity=".67"/>
        <path d="M430 295q38-13 66 5t70 2q43-18 86-4" fill="none" stroke="#dfbb88" strokeWidth="10" opacity=".76"/>
        <path d="M376 224q60-70 149-69t145 68M340 405q87 67 194 60t181-63" fill="none" stroke="#e0a77c" strokeWidth="2" opacity=".42"/>
        <path d="M50 89q80 40 116 7t99 15M90 520q85-55 140-20t120 6M758 130q46 36 106 6t132-2M765 490q77-55 133-12t112 0" fill="none" stroke="#e4b18b" strokeWidth="3" opacity=".38"/>
        <rect width="1000" height="650" fill="url(#grain)"/>
        {activeLayers.includes('MOLA Elevation') && <g opacity=".28" fill="none" stroke="#f2d6a0"><path d="M0 180q180-70 310 0t300 0 390-10M0 210q180-70 310 0t300 0 390-10M0 455q180-70 310 0t300 0 390-10M0 480q180-70 310 0t300 0 390-10"/></g>}
        {routeOn && <><path d="M540 304 C600 280 613 275 630 253 S680 270 730 344" fill="none" stroke="#f3a06f" strokeWidth="3" strokeDasharray="7 7"/><path d="M540 304 C600 280 613 275 630 253 S680 270 730 344" fill="none" stroke="#f3a06f" strokeWidth="12" opacity=".15" filter="url(#soft)"/></>}
      </svg>
      {stops.map((stop) => <button key={stop.id} className={`map-marker marker-${stop.id}`} style={{ left: `${stop.x}%`, top: `${stop.y}%`, '--marker': stop.color }} onClick={() => onSelect(stop)} aria-label={stop.name}><span className="marker-pulse"/><span className="marker-dot"/><span className="marker-label">{stop.name}</span></button>)}
      {routeOn && <><div className="route-tag start-tag">START · LANDER</div><div className="route-tag end-tag">DESTINATION</div></>}
    </div>
    <div className="map-coordinates"><Crosshair size={13}/> 18.4447° N &nbsp; 77.4508° E <span>·</span> <span className="live-dot"/> LOCAL PREVIEW</div>
    <div className="map-actions"><button aria-label="Zoom in" onClick={() => setZoom(Math.min(1.5, zoom + .1))}><Plus size={16}/></button><button aria-label="Zoom out" onClick={() => setZoom(Math.max(.85, zoom - .1))}><Minus size={16}/></button><i/><button aria-label="Reset view" onClick={() => setZoom(1)}><Crosshair size={15}/></button></div>
    <div className="map-scale"><span/><span>0</span><span>25 km</span></div>
    <div className="map-attribution">ILLUSTRATIVE TERRAIN · NOT NASA IMAGERY</div>
  </div>
}

function MapZoomButtons() {
  const map = useMap()
  return <div className="map-actions"><button aria-label="Zoom in" onClick={() => map.zoomIn()}><Plus size={16}/></button><button aria-label="Zoom out" onClick={() => map.zoomOut()}><Minus size={16}/></button><i/><button aria-label="Reset view" onClick={() => map.setView([18.4447, 77.4508], 10)}><Crosshair size={15}/></button></div>
}

function MarsMap({ activeLayers, routeOn, onSelect }) {
  const [tileState, setTileState] = useState('loading')
  const route = [[18.4447, 77.4508], [18.46, 77.48], [18.47, 77.51]]
  const iconFor = (stop) => L.divIcon({ className: 'nasa-marker-shell', html: `<span class="nasa-marker" style="--marker:${stop.color}"><i></i><b>${stop.name}</b></span>`, iconSize: [20, 20], iconAnchor: [10, 10] })
  return <div className="map-canvas nasa-map">
    <MapContainer crs={L.CRS.EPSG4326} center={[18.4447, 77.4508]} zoom={10} minZoom={1} maxZoom={19} scrollWheelZoom>
      {['MOLA Elevation', 'CTX Imagery', 'HiRISE Imagery'].filter((layer) => activeLayers.includes(layer)).map((layer) => {
        const source = NASA_LAYERS[layer]
        const url = source.url || `https://trek.nasa.gov/tiles/Mars/EQ/${source.id}/1.0.0/default/default028mm/{z}/{y}/{x}.${source.ext}`
        return <TileLayer key={layer} url={url} tileSize={source.tileSize} zoomOffset={source.zoomOffset || 0} maxNativeZoom={source.maxNativeZoom} opacity={source.opacity} minZoom={0} maxZoom={19} eventHandlers={{ tileload: () => setTileState('loaded'), tileerror: () => setTileState((state) => state === 'loaded' ? state : 'error') }} attribution="NASA Solar System Treks" />
      })}
      {stops.map((stop) => <Marker key={stop.id} position={[stop.lat, stop.lon]} icon={iconFor(stop)} eventHandlers={{ click: () => onSelect(stop) }} />)}
      {routeOn && <Polyline positions={route} pathOptions={{ color: '#f39a70', weight: 3, dashArray: '7 7' }} />}
      <ScaleControl position="bottomleft" metric imperial={false}/><MapZoomButtons/>
    </MapContainer>
    <div className="map-top-chip"><div className="tiny-mars"/><span>Jezero Crater</span><ChevronDown size={13}/></div>
    <div className="nasa-map-status"><span className={tileState === 'loaded' ? 'live-dot' : tileState === 'error' ? 'error-dot' : 'loading-dot'}/>{tileState === 'loaded' ? 'NASA WMTS · IMAGERY LOADED' : tileState === 'error' ? 'NASA WMTS · SOME TILES UNAVAILABLE' : 'LOADING NASA WMTS…'}</div>
    {routeOn && <><div className="route-tag start-tag">START · LANDER</div><div className="route-tag end-tag">DESTINATION</div></>}
    <div className="map-attribution">NASA SOLAR SYSTEM TREKS · WMTS</div>
  </div>
}

function SecondaryPage({ active, activeLayers, toggleLayer, routeOn, setRouteOn, setSelected, setNotice }) {
  const titles = {
    'Mars map': ['MAP EXPLORER', 'Explore Mars', 'Browse the Jezero field map and its local preview layers.'],
    'Route planner': ['FIELD OPERATIONS', 'Plan a rover route', 'Choose a science destination and preview a route on the map.'],
    'Science log': ['PERSEVERANCE · SOL 1,428', 'Science explorer', 'Review the targets highlighted across the Jezero mission area.'],
    'Saved places': ['YOUR WORKSPACE', 'Saved places', 'A short list of regions and targets saved for this mission.'],
    'Mission reports': ['MISSION ARCHIVE', 'Mission reports', 'Create a local report preview from the current route and mission notes.'],
  }
  const [eyebrow, title, subtitle] = titles[active] || titles['Mars map']
  return <div className="content-wrap secondary-page">
    <div className="page-intro"><div><div className="eyebrow"><span className="eyebrow-line"/>{eyebrow}</div><h1>{title}<span>.</span></h1><p className="subtitle">{subtitle}</p></div>{active === 'Mission reports' && <button className="primary-button" onClick={() => setNotice('Local mission report preview generated.')}><Download size={15}/> Generate report</button>}</div>
    {active === 'Mars map' && <>
      <div className="secondary-map"><MarsMap activeLayers={activeLayers} routeOn={routeOn} onSelect={setSelected}/></div>
      <div className="secondary-layer-row"><b><Layers size={15}/> Map layers</b>{layerNames.map((layer) => <label key={layer}><input type="checkbox" checked={activeLayers.includes(layer)} onChange={() => toggleLayer(layer)}/>{layer}</label>)}<span className="preview-disclaimer">Illustrative map preview · NASA imagery not connected</span></div>
    </>}
    {active === 'Route planner' && <div className="planner-layout"><div className="planner-panel"><div className="panel-header"><div><div className="eyebrow small-eyebrow">ROUTE BUILDER</div><h2>Set your destination</h2></div><span className="sol-pill">LOCAL PREVIEW</span></div><label className="form-label">STARTING POINT<select defaultValue="landing"><option value="landing">Octavia E. Butler Landing</option><option value="delta">Delta Front</option><option value="shenandoah">Shenandoah</option></select></label><div className="form-route-dot"/><label className="form-label">DESTINATION<select defaultValue="delta"><option value="delta">Delta Front</option><option value="shenandoah">Shenandoah</option><option value="landing">Octavia E. Butler Landing</option></select></label><div className="planner-summary"><div><small>ESTIMATED DISTANCE</small><b>{routeOn ? '2.4 km' : '—'}</b></div><div><small>ESTIMATED DURATION</small><b>{routeOn ? '3 sols' : '—'}</b></div></div><button className="route-button" onClick={() => {setRouteOn(!routeOn);setNotice(routeOn?'Route cleared from preview.':'Illustrative route added to map preview.')}}><Route size={14}/>{routeOn?'Clear route':'Preview route'}<ArrowUpRight size={14}/></button><p className="preview-disclaimer">Route distance and duration are illustrative. No rover navigation data is connected.</p></div><div className="planner-map"><MarsMap activeLayers={activeLayers} routeOn={routeOn} onSelect={setSelected}/></div></div>}
    {active === 'Science log' && <div className="page-card-grid">{stops.map((stop,i)=><button className="science-detail-card" key={stop.id} onClick={() => setSelected(stop)}><span className={`target-index index-${i+1}`}>TARGET 0{stop.id}</span><div className="science-art art-${i+1}"><span>{['Jezero Crater','Delta Front','Shenandoah'][i]}</span></div><h2>{stop.name}</h2><p>{['Landing region and ancient crater lake environment.','Layered deposits at the margin of an ancient river delta.','A planned science waypoint along the crater floor.'][i]}</p><div className="science-card-foot"><span className={`target-state state-${i}`}>{['IN REVIEW','UP NEXT','PLANNED'][i]}</span><span>Sol 1,428</span><ChevronRight size={14}/></div></button>)}</div>}
    {active === 'Saved places' && <div className="page-card-grid saved-grid">{stops.map((stop,i)=><button className="saved-place-card" key={stop.id} onClick={() => setSelected(stop)}><div className={`saved-art art-${i+1}`}><MapPin size={17}/></div><span className="eyebrow small-eyebrow">JEZERO CRATER</span><h2>{stop.name}</h2><p>{stop.type} · 18.44° N, 77.45° E</p><span className="text-button">Open place <ArrowUpRight size={14}/></span></button>)}</div>}
    {active === 'Mission reports' && <div className="reports-grid"><article className="report-card"><div className="report-icon"><Route size={19}/></div><div className="eyebrow small-eyebrow">CURRENT PLAN</div><h2>Jezero field route</h2><p>Starting point: Octavia E. Butler Landing<br/>Destination: {routeOn?'Delta Front':'Not selected'}<br/>Estimated distance: {routeOn?'2.4 km':'Route not planned'}</p><button className="secondary-button" onClick={() => {setRouteOn(true);setNotice('Illustrative route added to report preview.')}}><Route size={14}/> Add route to report</button></article><article className="report-card"><div className="report-icon"><Telescope size={19}/></div><div className="eyebrow small-eyebrow">SCIENCE NOTES</div><h2>Targets in this region</h2><p>3 highlighted science targets<br/>Region: Jezero Crater<br/>Mission day: Sol 1,428</p><button className="secondary-button" onClick={() => setNotice('Science summary added to report preview.')}><Sparkles size={14}/> Add science summary</button></article><article className="report-card report-ready"><div className="report-icon"><Download size={19}/></div><div className="eyebrow small-eyebrow">REPORT PREVIEW</div><h2>Ready to generate</h2><p>Combine route details and science stops into a local report preview.</p><button className="primary-button" onClick={() => setNotice('Local mission report preview generated.')}><Download size={14}/> Generate report</button></article></div>}
  </div>
}

function App() {
  const [active, setActive] = useState('Overview')
  const [activeLayers, setActiveLayers] = useState(['CTX Imagery', 'MOLA Elevation'])
  const [routeOn, setRouteOn] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showLayers, setShowLayers] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [notice, setNotice] = useState('')
  const toggleLayer = (name) => setActiveLayers((layers) => layers.includes(name) ? layers.filter((item) => item !== name) : [...layers, name])
  const nav = [{ label: 'MISSION', items: [['Overview', Gauge], ['Mars map', Map], ['Route planner', Route], ['Science log', Telescope]] }, { label: 'WORKSPACE', items: [['Saved places', MapPin], ['Mission reports', Activity]] }]
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><span/></div><div><b>MARS<span>EXPLORER</span></b><small>MISSION CONTROL <i/></small></div><button className="mobile-close" onClick={() => setMobileNav(false)}><X size={17}/></button></div>
      <div className="mission-switch"><div className="mission-icon"><Radio size={16}/></div><div><small>ACTIVE MISSION</small><b>Perseverance <ChevronDown size={13}/></b></div><span className="online-dot"/></div>
      <div className="nav-groups">{nav.map(group => <div className="nav-group" key={group.label}><p>{group.label}</p>{group.items.map(([label, Icon]) => <button key={label} className={`nav-item ${active === label ? 'selected' : ''}`} onClick={() => {setActive(label);setMobileNav(false); if(label==='Route planner') setRouteOn(true)}}><Icon size={16}/><span>{label}</span>{label==='Overview'&&<span className="nav-active-dot"/>}</button>)}</div>)}</div>
      <div className="sidebar-bottom"><div className="connection"><span className="online-dot"/><div><b>Systems nominal</b><small>Last sync · 4 min ago</small></div><ChevronRight size={14}/></div><button className="profile"><div className="avatar">MC</div><span><b>Mission Control</b><small>Research team</small></span><Settings2 size={16}/></button></div>
    </aside>
    {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation"/>}
    <main className="main-content">
      <header className="topbar"><button className="hamburger" onClick={() => setMobileNav(true)}><Menu size={19}/></button><div className="breadcrumbs">MISSION CONTROL <ChevronRight size={13}/> <span>{active.toUpperCase()}</span></div><div className="topbar-right"><div className="mars-clock"><span className="online-dot"/> SOL 1,428 <i>·</i> 14:32 LMST</div><button className="icon-button" onClick={() => setNotice('You’re all caught up.')} aria-label="Notifications"><Bell size={17}/><em/></button><div className="top-divider"/><button className="avatar top-avatar">MC</button></div></header>
      {active !== 'Overview' && <SecondaryPage active={active} activeLayers={activeLayers} toggleLayer={toggleLayer} routeOn={routeOn} setRouteOn={setRouteOn} setSelected={setSelected} setNotice={setNotice}/>}
      <div className={`content-wrap ${active === 'Overview' ? '' : 'overview-hidden'}`}>
        <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line"/> PERSEVERANCE ROVER <span className="eyebrow-status">● ACTIVE</span></div><h1>Mission overview<span>.</span></h1><p className="subtitle">A field view of our next chapter on the red planet.</p></div><div className="welcome-actions"><button className="secondary-button" onClick={() => setNotice('Report preview is ready to explore.') }><Download size={15}/> Export report</button><button className="primary-button" onClick={() => {setActive('Mars map'); document.getElementById('map-section')?.scrollIntoView({behavior:'smooth'})}}><Map size={15}/> Open Mars map <ArrowUpRight size={15}/></button></div></section>
        <section className="stat-grid"><article className="stat-card"><div className="stat-top"><span>MISSION SOL</span><div className="stat-icon"><Activity size={15}/></div></div><div className="stat-value">1,428 <small>sols</small></div><div className="stat-foot"><span className="trend-up"><ArrowUpRight size={12}/> 12</span> since last milestone</div><div className="spark spark-orange"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></article><article className="stat-card"><div className="stat-top"><span>DISTANCE TRAVERSED</span><div className="stat-icon"><Navigation size={15}/></div></div><div className="stat-value">32.84 <small>km</small></div><div className="stat-foot"><span className="trend-up"><ArrowUpRight size={12}/> 1.2 km</span> this week</div><div className="spark spark-gold"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></article><article className="stat-card"><div className="stat-top"><span>SCIENCE TARGETS</span><div className="stat-icon"><Target size={15}/></div></div><div className="stat-value">18 <small>sites</small></div><div className="stat-foot"><span className="trend-neutral">06</span> awaiting analysis</div><div className="target-stack"><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></div></article><article className="stat-card"><div className="stat-top"><span>ROVER HEALTH</span><div className="stat-icon"><Thermometer size={15}/></div></div><div className="stat-value health-value"><span className="health-dot"/>Nominal</div><div className="stat-foot">All core systems operational</div><div className="health-bar"><i/></div></article></section>
        <section className="map-section" id="map-section"><div className="section-heading"><div><div className="eyebrow small-eyebrow">FIELD OPERATIONS <span className="heading-sep">/</span> SOL 1,428</div><h2>Explore the terrain</h2></div><div className="map-heading-actions"><span className="map-status"><span className="live-dot"/> LIVE PREVIEW</span><button className="square-button" onClick={() => setShowLayers(!showLayers)}><Layers size={15}/> <span>Layers</span><ChevronDown size={13}/></button><button className="square-button filter-button" onClick={() => setNotice('Map filters are up to date.')}><SlidersHorizontal size={15}/></button></div></div>
          <div className="map-layout"><div className="map-frame"><MarsMap activeLayers={activeLayers} routeOn={routeOn} onSelect={setSelected}/>{showLayers&&<div className="layers-popover"><div className="popover-title">MAP LAYERS <button onClick={()=>setShowLayers(false)}><X size={14}/></button></div>{layerNames.map((layer,i)=><label key={layer}><span className={`layer-swatch swatch-${i}`}/><span>{layer}<small>{['Context camera mosaic','High resolution imaging','Elevation model'][i]}</small></span><input type="checkbox" checked={activeLayers.includes(layer)} onChange={()=>toggleLayer(layer)}/></label>)}<p>Illustrative preview only. NASA imagery is not connected.</p></div>}<div className="map-top-chip"><div className="tiny-mars"/><span>Jezero Crater</span><ChevronDown size={13}/></div><button className="map-expand" title="Open map" onClick={()=>{setActive('Mars map');setNotice('Map view selected.')}}><MousePointer2 size={15}/></button></div>
            <aside className="map-side"><div className="region-card"><div className="region-image"><div className="region-sun"/><div className="region-ridge ridge-one"/><div className="region-ridge ridge-two"/><div className="region-ridge ridge-three"/><span>NASA / JPL · CONCEPTUAL</span></div><div className="region-info"><div className="region-kicker">CURRENT REGION <ExternalLink size={12}/></div><h3>Jezero Crater</h3><p>Ancient lakebed · Western Isidis Planitia</p><div className="region-coords"><MapPin size={13}/> 18.38° N, 77.58° E</div></div><div className="region-metrics"><div><small>DIAMETER</small><b>45.0 <i>km</i></b></div><div><small>ELEVATION</small><b>−2,575 <i>m</i></b></div><div><small>MISSION DAY</small><b>1,428 <i>sol</i></b></div></div></div>
              <div className="route-card"><div className="card-heading"><div><span className="mini-icon"><Route size={14}/></span><b>Route planner</b></div><button onClick={()=>setNotice('Route settings opened.')}><Settings2 size={15}/></button></div><div className="route-field"><span className="route-node start-node"/><div><small>STARTING POINT</small><b>Octavia E. Butler Landing</b></div><ChevronDown size={14}/></div><div className="route-connector"><span/></div><div className="route-field"><span className="route-node end-node"/><div><small>DESTINATION</small><b>{routeOn?'Delta Front':'Choose a science target'}</b></div><ChevronDown size={14}/></div>{routeOn&&<div className="route-result"><span>ESTIMATED ROUTE</span><b>2.4 km <i>·</i> 3 sols</b></div>}<button className="route-button" onClick={()=>{setRouteOn(!routeOn);if(!routeOn)setNotice('Illustrative route added to map.')}}><Route size={14}/>{routeOn?'Clear route':'Plan a route'}<ArrowUpRight size={14}/></button><div className="route-note">Preview path · Distance estimate is illustrative</div></div>
            </aside></div>
        </section>
        <section className="lower-grid"><div className="science-panel"><div className="panel-header"><div><div className="eyebrow small-eyebrow">FIELD NOTES</div><h2>Science targets</h2></div><button className="text-button" onClick={()=>{setActive('Science log');setNotice('Showing all science targets.')}}>View all <ArrowUpRight size={14}/></button></div><div className="target-list">{stops.map((stop,i)=><button className="target-row" key={stop.id} onClick={()=>setSelected(stop)}><span className={`target-index index-${i+1}`}>0{stop.id}</span><span className="target-main"><b>{stop.name}</b><small>{stop.type}</small></span><span className={`target-state state-${i}`}>{['IN REVIEW','UP NEXT','PLANNED'][i]}</span><ChevronRight size={14}/></button>)}</div><div className="science-footer"><Sparkles size={13}/> 3 of 18 targets shown <span>·</span> Curated mission log</div></div><div className="conditions-panel"><div className="panel-header"><div><div className="eyebrow small-eyebrow">ENVIRONMENT</div><h2>Surface conditions</h2></div><span className="sol-pill">SOL 1,428</span></div><div className="condition-row"><span className="condition-icon"><Thermometer size={15}/></span><span><small>AIR TEMPERATURE</small><b>−63°C <i>·</i> stable</b></span><div className="condition-track"><i style={{width:'38%'}}/></div></div><div className="condition-row"><span className="condition-icon"><Activity size={15}/></span><span><small>ATMOSPHERIC PRESSURE</small><b>7.4 <i>mbar</i></b></span><div className="pressure-chart"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></div><div className="conditions-note"><span className="live-dot"/> Latest conditions from mission summary <span>·</span> 2h ago</div></div></section>
        <footer className="footer"><span>© 2025 MARS EXPLORER <i>·</i> MISSION CONTROL CONCEPT</span><span>BUILT FOR CURIOSITY <Sparkles size={12}/></span></footer>
      </div>
    </main>
    {selected&&<div className="detail-overlay" onClick={()=>setSelected(null)}><div className="detail-drawer" onClick={e=>e.stopPropagation()}><button className="drawer-close" onClick={()=>setSelected(null)}><X size={18}/></button><div className="drawer-art"><div className="drawer-orb"/><div className="drawer-crater"/></div><div className="drawer-content"><div className="eyebrow small-eyebrow">SCIENCE TARGET <span className="heading-sep">/</span> SOL 1,428</div><h2>{selected.name}</h2><span className="drawer-type">{selected.type}</span><p>An area of scientific interest within Jezero Crater, selected for its geological context and potential to help us understand the ancient Martian environment.</p><div className="drawer-facts"><div><small>COORDINATES</small><b>18.44° N, 77.45° E</b></div><div><small>OBSERVATION STATUS</small><b>Planned observation</b></div><div><small>REGION</small><b>Jezero Crater, Mars</b></div></div><button className="primary-button drawer-action" onClick={()=>{setRouteOn(true);setSelected(null);setNotice('Illustrative route added to map.')}}><Route size={15}/> Add to route</button></div></div></div>}
    {notice&&<div className="toast"><span className="toast-check">✓</span>{notice}<button onClick={()=>setNotice('')}><X size={14}/></button></div>}
  </div>
}
export default App
