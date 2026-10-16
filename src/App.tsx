import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { HouseArt, PlanArt } from './Art'
import { TapeReel } from './TapeReel'
import { ProjectDialog } from './ProjectDialog'
import { budgetBands, formatPrice, listings, projects, steps, typeFilters, type HomeType, type Project } from './data'

const PORTFOLIO = 'https://portfolio-rkv6.vercel.app/'

export default function App() {
  const [tf, setTf] = useState<'All' | HomeType>('All')
  const [bf, setBf] = useState('any')
  const [interest, setInterest] = useState('Both')
  const [property, setProperty] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

  const [openId, setOpenId] = useState<string | null>(null)
  const pushed = useRef(false)
  const idFromHash = () => {
    const m = window.location.hash.match(/^#project-(.+)$/)
    return m && projects.some((p) => p.id === m[1]) ? m[1] : null
  }
  useEffect(() => {
    setOpenId(idFromHash())
    const on = () => setOpenId(idFromHash())
    window.addEventListener('popstate', on)
    return () => window.removeEventListener('popstate', on)
  }, [])
  useEffect(() => {
    document.documentElement.style.overflow = openId ? 'hidden' : ''
  }, [openId])
  const openProject = (id: string) => {
    window.history.pushState(null, '', `#project-${id}`)
    pushed.current = true
    setOpenId(id)
  }
  const closeProject = () => {
    if (!idFromHash()) { setOpenId(null); return }
    if (pushed.current) { pushed.current = false; window.history.back() }
    else { window.history.replaceState(null, '', window.location.pathname + window.location.search); setOpenId(null) }
  }
  const openProjectData = projects.find((p) => p.id === openId) ?? null

  const shownHomes = useMemo(() => {
    const band = budgetBands.find((b) => b.id === bf)!
    return listings.filter((l) => (tf === 'All' || l.type === tf) && band.test(l.lakh))
  }, [tf, bf])

  function enquire(label: string, kind = 'Buy a home') {
    setProperty(label)
    setInterest(kind)
    document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth' })
  }
  function enquireProject(p: Project) {
    closeProject()
    window.setTimeout(() => enquire(`Something like ${p.name}, ${p.place}`, 'Interior design'), 160)
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const name = String(f.get('name') || '').trim()
    const phone = String(f.get('phone') || '').replace(/\D/g, '')
    const next: typeof errors = {}
    if (!name) next.name = 'Please tell us your name.'
    if (phone.length < 10) next.phone = 'Enter a 10 digit mobile number so we can call you back.'
    setErrors(next)
    if (next.name || next.phone) return
    const lines = [
      'Hello Veedu Studio, I would like to enquire.',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Looking for: ${f.get('interest')}`,
      f.get('property') ? `Property: ${f.get('property')}` : '',
      `Budget: ${f.get('budget')}`,
      f.get('note') ? `Note: ${String(f.get('note')).trim()}` : '',
    ].filter(Boolean)
    window.location.href = `/api/enquiry?text=${encodeURIComponent(lines.join('\n'))}`
  }

  return (
    <>
      <a className="skip" href="#projects">Skip to projects</a>
      <header className="top">
        <a className="mark" href="#top" aria-label="Veedu Studio, home"><span>Veedu</span><small>Studio</small></a>
        <nav aria-label="Main">
          <a href="#projects">Projects</a>
          <a href="#homes">Homes for sale</a>
          <a href="#studio">Studio</a>
          <a href="#process">Process</a>
        </nav>
        <a className="btn btn-sm" href="#enquire">Enquire</a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <h1>Homes drawn for the way you <em>live.</em></h1>
            <p className="lead">Veedu Studio designs interiors and helps families find a home to put them in, from Thiruvananthapuram down the coast to Kovalam and Varkala.</p>
            <div className="actions">
              <a className="btn" href="#homes">See homes for sale</a>
              <a className="btn btn-ghost" href="#enquire">Plan a site visit</a>
            </div>
          </div>
          <div className="hero-art"><HouseArt /></div>
        </section>

        <TapeReel onOpen={openProject} />

        <section className="block tint" id="homes" aria-labelledby="h-homes">
          <div className="head">
            <h2 id="h-homes">Homes we can show you</h2>
            <div className="filters">
              <div className="chips" role="group" aria-label="Home type">
                {typeFilters.map((t) => (
                  <button key={t} className="chip" aria-pressed={tf === t} onClick={() => setTf(t)}>{t === 'All' ? 'All types' : t}</button>
                ))}
              </div>
              <label className="select">
                <span className="sr">Budget</span>
                <select value={bf} onChange={(e) => setBf(e.target.value)}>
                  {budgetBands.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
                </select>
              </label>
            </div>
          </div>
          {shownHomes.length === 0 ? (
            <p className="empty">Nothing matches that yet. <button className="link" onClick={() => { setTf('All'); setBf('any') }}>Clear the filters</button> or tell us what you need and we will look.</p>
          ) : (
            <ul className="homes">
              {shownHomes.map((l) => (
                <li key={l.id} className="home">
                  <div className="plan-wrap"><PlanArt rooms={l.plan} name={l.title} /></div>
                  <div className="home-body">
                    <p className="price">{formatPrice(l.lakh)}</p>
                    <h3>{l.title}</h3>
                    <p className="where">{l.place}, {l.type}</p>
                    <p>{l.detail}</p>
                    <p className="facts">
                      {l.beds > 0 && <span>{l.beds} bedrooms</span>}
                      <span>{l.area.toLocaleString('en-IN')} {l.unit}</span>
                    </p>
                    <button className="btn btn-sm btn-ghost" onClick={() => enquire(`${l.title}, ${l.place}`)}>Ask about this home</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="block studio" id="studio" aria-labelledby="h-studio">
          <div className="studio-main">
            <h2 id="h-studio">One team from the first sketch to the last switch</h2>
            <p>Most families hire a designer, then a contractor, then an electrician, and spend the year carrying messages between them. We keep the drawing, the carpenters and the site supervisor under one roof, so the room you approve is the room you get.</p>
            <p>The same team helps you find the home. We have walked the apartments, villas and plots listed here and can tell you what the brochure leaves out: where the water pressure drops, which side gets the monsoon, what a wall can and cannot take.</p>
          </div>
          <ul className="services">
            <li><h3>Interior design</h3><p>Rooms, kitchens and whole homes, drawn and built by one team.</p></li>
            <li><h3>Home search</h3><p>Apartments, villas and plots we have walked, with the honest notes.</p></li>
            <li><h3>Site supervision</h3><p>A weekly progress report and one person to call when something is off.</p></li>
          </ul>
        </section>

        <section className="block night" id="process" aria-labelledby="h-process">
          <h2 id="h-process">How a project runs</h2>
          <ol className="steps">
            {steps.map((s) => (
              <li key={s.title}><h3>{s.title}</h3><p>{s.text}</p></li>
            ))}
          </ol>
        </section>

        <section className="block enquire" id="enquire" aria-labelledby="h-enq">
          <div className="enq-copy">
            <h2 id="h-enq">Tell us about the home</h2>
            <p>Send a few details and the conversation opens in WhatsApp, ready to send.</p>
            <ul className="next">
              <li><strong>The same day</strong><span>We reply on WhatsApp with a time for a site visit.</span></li>
              <li><strong>Within a week</strong><span>We visit, measure and listen to how you live.</span></li>
              <li><strong>In ten days</strong><span>You get a written plan with materials and prices.</span></li>
            </ul>
          </div>
          <form onSubmit={submit} noValidate>
            <div className="row">
              <label>Your name
                <input name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />
                {errors.name && <span className="err" id="e-name">{errors.name}</span>}
              </label>
              <label>Mobile number
                <input name="phone" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'e-phone' : undefined} />
                {errors.phone && <span className="err" id="e-phone">{errors.phone}</span>}
              </label>
            </div>
            <div className="row">
              <label>I am looking for
                <select name="interest" value={interest} onChange={(e) => setInterest(e.target.value)}>
                  <option>Interior design</option><option>Buy a home</option><option>Both</option>
                </select>
              </label>
              <label>Budget
                <select name="budget" defaultValue="Not sure yet">
                  <option>Not sure yet</option><option>Under ₹10 lakh</option><option>₹10 to 50 lakh</option><option>₹50 lakh to 1.5 crore</option><option>Above ₹1.5 crore</option>
                </select>
              </label>
            </div>
            <label><span>Home or project <span className="opt">(optional)</span></span>
              <input name="property" value={property} onChange={(e) => setProperty(e.target.value)} placeholder="For example, Courtyard villa, Kovalam" />
            </label>
            <label><span>Anything else <span className="opt">(optional)</span></span>
              <textarea name="note" rows={3} />
            </label>
            <button className="btn" type="submit">Continue on WhatsApp</button>
            <p className="fine">Nothing is stored on this site. Your details only go into the WhatsApp message you choose to send.</p>
          </form>
        </section>
      </main>

      <ProjectDialog project={openProjectData} onClose={closeProject} onEnquire={enquireProject} />

      <footer className="foot">
        <p><strong>Veedu Studio</strong>, Thiruvananthapuram. A concept site for a fictional studio: the homes, prices and projects are made up.</p>
        <a href={PORTFOLIO}>See more work by Rithin K Varghese →</a>
      </footer>
    </>
  )
}
