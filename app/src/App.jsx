import { useState, useMemo, Fragment } from 'react'
import './App.css'
import RelationshipFamilyTimeline from './RelationshipFamilyTimeline'
import InlineTimelineCitizenship from './InlineTimelineCitizenship'

// ── PHUC'S LIFE DATA ──
const BIRTH = new Date(2001, 10, 21) // Nov 21, 2001
const LIFE_EXPECTANCY = 90

// ── LIFE PHASES (corrected timeline) ──
// Born Nov 21, 2001. Age = (date - birth) / 365.25
// Now: age 24.3 (Mar 2026). A-levels May-Jun 2026.
// BSc: Sep 2027 → Jun 2030 (age ~25.8 → 28.6) = 3 years
// Masters: Sep 2030 → Jun 2031 (age ~28.8 → 29.6) = 1 year
// PhD: Sep 2031 → Jun 2035 (age ~29.8 → 33.6) = 4 years (mid-range of 3-5)
// Career: age ~33.6 → 65
const PHASES = [
  { id: 'childhood', label: 'Childhood (Vietnam)', start: 0, end: 9, color: '#ffd60a', emoji: '💒' },
  { id: 'school', label: 'School (9th grade)', start: 9, end: 15, color: '#ff9500', emoji: '🏫' },
  { id: 'selfstudy', label: 'Self-directed learning', start: 15, end: 20, color: '#ff6b35', emoji: '📚' },
  { id: 'huggingface', label: 'Hugging Face', start: 20, end: 24, color: '#34c759', emoji: '🤗' },
  { id: 'nous', label: 'Nous Research + A-levels', start: 24, end: 25.8, color: '#30d158', emoji: '🔬' },
  { id: 'university', label: 'UCL BSc (3 yr)', start: 25.8, end: 28.6, color: '#007aff', emoji: '🎓' },
  { id: 'masters', label: 'Masters (1 yr)', start: 28.8, end: 29.6, color: '#0071e3', emoji: '📐' },
  { id: 'phd', label: 'PhD (4 yr)', start: 29.8, end: 33.6, color: '#5856d6', emoji: '🧪' },
  { id: 'career', label: 'Career', start: 33.6, end: 65, color: '#af52de', emoji: '🚀' },
  { id: 'retirement', label: 'Later life', start: 65, end: 90, color: '#86868b', emoji: '🌅' },
]

// ── FUTURE ROADMAP: Now (24.3) → retirement at 65, with exact year ranges ──
const ROADMAP_START_AGE = 24.3 // Mar 2026
const ROADMAP_END_AGE = 65
const ROADMAP_PHASES = [
  { id: 'alevels', label: 'A-Levels + Nous', startAge: 24.3, endAge: 25.8, startDate: 'Mar 2026', endDate: 'Sep 2027', color: '#30d158', emoji: '🔬', desc: 'Exam prep (Math, FM, Physics) while working at Nous Research' },
  { id: 'bsc', label: 'UCL BSc Theoretical Physics', startAge: 25.8, endAge: 28.6, startDate: 'Sep 2027', endDate: 'Jun 2030', color: '#007aff', emoji: '🎓', desc: '3-year undergraduate degree at University College London' },
  { id: 'masters', label: 'Masters (1 year)', startAge: 28.8, endAge: 29.6, startDate: 'Sep 2030', endDate: 'Jun 2031', color: '#0071e3', emoji: '📐', desc: '1-year masters degree, likely theoretical physics or AI' },
  { id: 'phd', label: 'PhD (4 years)', startAge: 29.8, endAge: 33.6, startDate: 'Sep 2031', endDate: 'Jun 2035', color: '#5856d6', emoji: '🧪', desc: 'Doctoral research — theoretical physics or AI' },
  { id: 'career', label: 'Career', startAge: 33.6, endAge: 65, startDate: 'Jul 2035', endDate: '2066', color: '#af52de', emoji: '🚀', desc: 'Post-PhD career through retirement at age 65' },
]

// Alternative education route requested for a 2028 university start.
// The proportional bar uses a 4-year PhD midpoint; labels preserve the full 3–5-year range.
const ROADMAP_2028_PHASES = [
  { id: 'prep', label: 'A-Levels + France runway', startAge: 24.3, endAge: 26.8, startDate: 'Mar 2026', endDate: 'Sep 2028', color: '#30d158', emoji: '🔬', desc: 'Complete the pre-university runway and protect the France/status plan before starting university.' },
  { id: 'undergrad', label: 'Undergraduate (3 years)', startAge: 26.8, endAge: 29.8, startDate: 'Sep 2028', endDate: 'Jun 2031', color: '#007aff', emoji: '🎓', desc: 'Three-year undergraduate degree beginning in 2028.' },
  { id: 'masters', label: 'Master (2 years)', startAge: 29.8, endAge: 31.8, startDate: 'Sep 2031', endDate: 'Jun 2033', color: '#0071e3', emoji: '📐', desc: 'Two-year master degree immediately after the undergraduate degree.' },
  { id: 'phd', label: 'PhD (3–5 years)', startAge: 31.8, endAge: 35.8, startDate: 'Sep 2033', endDate: 'Jun 2036–38', color: '#5856d6', emoji: '🧪', desc: 'Doctoral research lasting three to five years; the visual width uses the four-year midpoint.', durationLabel: '3–5 yr', weeksLabel: '156–260', ageLabel: '31.8 → 34.8–36.8', pctLabel: '7.4–12.3%' },
  { id: 'career', label: 'Post-PhD career', startAge: 35.8, endAge: 65, startDate: 'Jul 2036–38', endDate: '2066', color: '#af52de', emoji: '🚀', desc: 'Post-PhD career begins between 2036 and 2038 and runs to retirement at 65; the visual start uses the 2037 midpoint.', durationLabel: '28.2–30.2 yr', weeksLabel: '1,466–1,570', ageLabel: '34.8–36.8 → 65', pctLabel: '69.3–74.2%' },
]

// ── KEY MILESTONES ──
const MILESTONES = [
  { age: 0, year: 2001, label: 'Born in Tay Ninh, Vietnam', done: true },
  { age: 15, year: 2016, label: 'Finished 9th grade, began self-study', done: true },
  { age: 18, year: 2019, label: 'Started learning ML/AI independently', done: true },
  { age: 20, year: 2021, label: 'Joined Hugging Face as Research Engineer', done: true },
  { age: 22, year: 2023, label: 'Published "The Ultra-Scale Playbook"', done: true },
  { age: 23, year: 2024, label: 'Presented at CNRS supercomputing facility', done: true },
  { age: 24, year: 2025, label: 'Joined Nous Research ($250K/yr)', done: true },
  { age: 24.5, year: 2026, label: 'A-level exams (Math, FM, Physics) — May 2026', done: false, current: true },
  { age: 25.8, year: 2027, label: 'Start UCL Theoretical Physics BSc', done: false },
  { age: 28.6, year: 2030, label: 'Graduate BSc, start Masters', done: false },
  { age: 29.6, year: 2031, label: 'Complete Masters, start PhD', done: false },
  { age: 33.6, year: 2035, label: 'Complete PhD, start career', done: false },
  { age: 40, year: 2041, label: 'Career milestone', done: false },
  { age: 50, year: 2051, label: 'Career milestone', done: false },
]

// ── LEADER REFERENCE MILESTONES (by age) ──
const LEADERS = [
  { id: 'hassabis', name: 'Demis Hassabis', color: '#ff9500', born: 1976, milestones: [
    { age: 20, label: 'BSc Cambridge CS (Double First)' },
    { age: 32, label: 'PhD UCL (Cognitive Neuroscience)' },
    { age: 34, label: 'Co-founded DeepMind' },
    { age: 37, label: 'DeepMind acquired by Google (~$500M)' },
    { age: 39, label: 'AlphaGo beats Lee Sedol' },
    { age: 44, label: 'AlphaFold2 solves protein folding' },
    { age: 48, label: 'Nobel Prize in Chemistry' },
  ]},
  { id: 'musk', name: 'Elon Musk', color: '#ff3b30', born: 1971, milestones: [
    { age: 24, label: 'BSc Physics + Economics (UPenn)' },
    { age: 28, label: 'Founded X.com (became PayPal)' },
    { age: 30, label: 'Founded SpaceX' },
    { age: 37, label: 'Became Tesla CEO' },
    { age: 39, label: 'Falcon 9 first successful launch' },
    { age: 49, label: 'SpaceX Crew Dragon to ISS' },
  ]},
  { id: 'sutskever', name: 'Ilya Sutskever', color: '#34c759', born: 1986, milestones: [
    { age: 19, label: 'BSc Mathematics (Toronto)' },
    { age: 26, label: 'AlexNet (revolutionized computer vision)' },
    { age: 27, label: 'PhD Computer Science (Toronto, Hinton)' },
    { age: 29, label: 'Co-founded OpenAI (Chief Scientist)' },
    { age: 38, label: 'Founded SSI (Safe Superintelligence)' },
  ]},
  { id: 'amodei', name: 'Dario Amodei', color: '#ff375f', born: 1983, milestones: [
    { age: 23, label: 'BSc Physics (Stanford)' },
    { age: 28, label: 'PhD Biophysics (Princeton)' },
    { age: 33, label: 'VP of Research at OpenAI' },
    { age: 38, label: 'Co-founded Anthropic' },
  ]},
  { id: 'huang', name: 'Jensen Huang', color: '#76b900', born: 1963, milestones: [
    { age: 21, label: 'BSc EE (Oregon State)' },
    { age: 30, label: 'Co-founded NVIDIA' },
    { age: 43, label: 'CUDA launched (GPU computing revolution)' },
    { age: 60, label: 'NVIDIA becomes most valuable company ($3T)' },
  ]},
  { id: 'murati', name: 'Mira Murati', color: '#ff6b35', born: 1988, milestones: [
    { age: 23, label: 'BEng (Dartmouth)' },
    { age: 33, label: 'CTO of OpenAI' },
    { age: 34, label: 'Shipped ChatGPT' },
    { age: 36, label: 'Founded Thinking Machines Lab ($12B)' },
  ]},
  { id: 'johnston', name: 'Philip Johnston', color: '#00c7be', born: 1986, milestones: [
    { age: 22, label: 'BSc Applied Math & Physics (Nottingham)' },
    { age: 37, label: 'Founded Starcloud (space data centers)' },
    { age: 39, label: 'First NVIDIA H100 in orbit' },
  ]},
  { id: 'hodak', name: 'Max Hodak', color: '#e040fb', born: 1989, milestones: [
    { age: 22, label: 'BSc Biomedical Engineering (Duke)' },
    { age: 27, label: 'Co-founded Neuralink (President)' },
    { age: 31, label: 'Founded Science Corp' },
    { age: 34, label: 'PRIMA retinal implant — FDA Breakthrough' },
  ]},
  { id: 'djseo', name: 'DJ Seo', color: '#b388ff', born: 1989, milestones: [
    { age: 22, label: 'BSc EE (Caltech)' },
    { age: 27, label: 'PhD EECS (UC Berkeley) — Neural Dust' },
    { age: 27, label: 'Co-founded Neuralink' },
  ]},
  { id: 'kaplan', name: 'Jared Kaplan', color: '#ff7043', born: 1983, milestones: [
    { age: 22, label: 'BSc Physics + Math (Stanford)' },
    { age: 26, label: 'PhD Physics (Harvard, under Arkani-Hamed)' },
    { age: 37, label: 'Scaling Laws paper (created the field)' },
    { age: 38, label: 'Co-founded Anthropic' },
  ]},
  { id: 'howard', name: 'Jeremy Howard', color: '#8d6e63', born: 1973, milestones: [
    { age: 18, label: 'BA Philosophy (Melbourne) — no technical degree' },
    { age: 25, label: 'Founded FastMail' },
    { age: 37, label: '#1 Kaggle competitor globally' },
    { age: 42, label: 'Co-founded fast.ai' },
    { age: 44, label: 'ULMFiT paper (foundation of modern LLMs)' },
    { age: 50, label: 'Founded Answer.AI' },
  ]},
  { id: 'tegmark', name: 'Max Tegmark', color: '#7e57c2', born: 1967, milestones: [
    { age: 23, label: 'BSc Physics (KTH Stockholm)' },
    { age: 27, label: 'PhD Physics (UC Berkeley)' },
    { age: 37, label: 'MIT Professor of Physics' },
    { age: 46, label: 'Co-founded Future of Life Institute' },
    { age: 50, label: 'Published Life 3.0' },
  ]},
  { id: 'sarkar', name: 'Deblina Sarkar', color: '#f06292', born: 1986, milestones: [
    { age: 22, label: 'B.E. Electronics (IIT Dhanbad)' },
    { age: 29, label: 'PhD UCSB — Nature paper (6-atom transistor)' },
    { age: 34, label: 'MIT Professor, founded Nano-Cybernetic Biotrek Lab' },
    { age: 36, label: 'IEEE Nano Early Career Award + NIH New Innovator' },
  ]},
  { id: 'isaacman', name: 'Jared Isaacman', color: '#546e7a', born: 1983, milestones: [
    { age: 16, label: 'Founded Shift4 Payments (dropped out of high school)' },
    { age: 37, label: 'Shift4 IPO ($345M)' },
    { age: 38, label: 'Commanded Inspiration4 (first all-civilian orbit)' },
    { age: 41, label: 'First private spacewalk (Polaris Dawn)' },
    { age: 42, label: 'NASA Administrator' },
  ]},
  { id: 'beck', name: 'Peter Beck', color: '#e53935', born: 1977, milestones: [
    { age: 29, label: 'Founded Rocket Lab (no degree)' },
    { age: 40, label: 'First Electron launch' },
    { age: 41, label: 'First successful orbital launch' },
    { age: 44, label: 'Rocket Lab IPO ($4.8B)' },
    { age: 47, label: 'Knighted (KNZM)' },
  ]},
]

// Get all leader milestones that happened at a given integer age
function getLeaderEventsAtAge(age) {
  const events = []
  LEADERS.forEach(l => {
    l.milestones.forEach(m => {
      if (Math.floor(m.age) === age) {
        events.push({ leader: l.name, color: l.color, ...m })
      }
    })
  })
  return events
}

// ── WEEKLY SCHEDULE (168 hours) ──
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

const ACTIVITIES = {
  sleep:    { label: 'Sleep', color: '#1c1c1e', textColor: '#8e8e93' },
  morning:  { label: 'Morning Routine', color: '#ff9500', textColor: '#fff' },
  study:    { label: 'A-Level Study', color: '#007aff', textColor: '#fff' },
  work:     { label: 'Nous Research', color: '#34c759', textColor: '#fff' },
  tutoring: { label: 'Tutoring', color: '#5856d6', textColor: '#fff' },
  training: { label: 'Training (Ange)', color: '#ff2d55', textColor: '#fff' },
  meal:     { label: 'Meals', color: '#ff6b35', textColor: '#fff' },
  commute:  { label: 'Commute', color: '#86868b', textColor: '#fff' },
  admin:    { label: 'Admin / Errands', color: '#af52de', textColor: '#fff' },
  leisure:  { label: 'Leisure / Rest', color: '#00c7be', textColor: '#fff' },
  social:   { label: 'Social / Dating', color: '#ff375f', textColor: '#fff' },
  free:     { label: 'Unallocated', color: '#f5f5f7', textColor: '#86868b' },
  review:   { label: 'Weekly Review', color: '#ffcc00', textColor: '#1d1d1f' },
  french:   { label: 'French (Preply)', color: '#0071e3', textColor: '#fff' },
}

function buildIdealWeek() {
  const w = {}
  DAYS.forEach(d => {
    w[d] = {}
    HOURS.forEach(h => { w[d][h] = 'free' })
  })

  // Sleep: 00-07 + 23
  DAYS.forEach(d => {
    for (let h = 0; h <= 7; h++) w[d][h] = 'sleep'
    w[d][23] = 'sleep'
  })

  // Morning routine: 8
  DAYS.forEach(d => { w[d][8] = 'morning' })

  // Weekdays
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  weekdays.forEach(d => {
    w[d][9] = 'study'; w[d][10] = 'study'; w[d][11] = 'study'
    w[d][12] = 'meal'
    w[d][13] = 'tutoring'; w[d][14] = 'tutoring'; w[d][15] = 'tutoring'
    w[d][16] = 'work'; w[d][17] = 'work'; w[d][18] = 'work'; w[d][19] = 'work'
    w[d][20] = 'meal'
    w[d][21] = 'leisure'; w[d][22] = 'leisure'
  })

  // Monday admin block
  w['Mon'][13] = 'admin'

  // French lessons
  w['Mon'][10] = 'french'; w['Wed'][10] = 'french'

  // Training: Tue/Wed 20-21, Sat/Sun 19-20
  w['Tue'][20] = 'training'; w['Tue'][21] = 'training'
  w['Wed'][20] = 'training'; w['Wed'][21] = 'training'
  w['Sat'][19] = 'training'; w['Sat'][20] = 'training'
  w['Sun'][19] = 'training'; w['Sun'][20] = 'training'

  // Weekends
  ;['Sat', 'Sun'].forEach(d => {
    w[d][9] = 'study'; w[d][10] = 'study'; w[d][11] = 'study'
    w[d][12] = 'meal'
    w[d][13] = 'study'; w[d][14] = 'study'; w[d][15] = 'study'
    w[d][16] = 'leisure'; w[d][17] = 'leisure'; w[d][18] = 'leisure'
    w[d][21] = 'meal'
    w[d][22] = 'leisure'
  })

  w['Sun'][16] = 'review'
  w['Sat'][16] = 'social'; w['Sat'][17] = 'social'

  return w
}

function buildCurrentWeek() {
  const w = {}
  DAYS.forEach(d => {
    w[d] = {}
    HOURS.forEach(h => { w[d][h] = 'free' })
  })

  DAYS.forEach(d => {
    for (let h = 0; h <= 8; h++) w[d][h] = 'sleep'
    w[d][23] = 'sleep'
  })

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  weekdays.forEach(d => {
    w[d][9] = 'leisure'; w[d][10] = 'leisure' // phone scrolling
    w[d][11] = 'morning'
    w[d][12] = 'commute'
    w[d][13] = 'meal'
    w[d][14] = 'work'; w[d][15] = 'work'; w[d][16] = 'work'
    w[d][17] = 'work'; w[d][18] = 'work'; w[d][19] = 'work'; w[d][20] = 'work'
    w[d][21] = 'commute'
    w[d][22] = 'meal'
  })

  w['Tue'][20] = 'training'; w['Tue'][21] = 'training'
  w['Wed'][20] = 'training'; w['Wed'][21] = 'training'
  w['Sat'][19] = 'training'; w['Sat'][20] = 'training'
  w['Sun'][19] = 'training'; w['Sun'][20] = 'training'

  ;['Sat', 'Sun'].forEach(d => {
    w[d][9] = 'leisure'; w[d][10] = 'leisure'; w[d][11] = 'leisure'
    w[d][12] = 'meal'
    w[d][13] = 'leisure'; w[d][14] = 'leisure'; w[d][15] = 'leisure'
    w[d][16] = 'leisure'; w[d][17] = 'leisure'; w[d][18] = 'leisure'
    w[d][21] = 'meal'; w[d][22] = 'leisure'
  })

  return w
}

function countHours(week) {
  const counts = {}
  Object.keys(ACTIVITIES).forEach(k => { counts[k] = 0 })
  DAYS.forEach(d => HOURS.forEach(h => { counts[week[d][h]] = (counts[week[d][h]] || 0) + 1 }))
  return counts
}

// ── COMPONENTS ──

function HeroStats({ futureOnly = false }) {
  const now = new Date()
  const ageMs = now - BIRTH
  const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000)
  const weeksLived = Math.floor(ageMs / (7 * 24 * 60 * 60 * 1000))
  const totalWeeks = LIFE_EXPECTANCY * 52
  const weeksLeft = totalWeeks - weeksLived
  const pctLived = (weeksLived / totalWeeks * 100).toFixed(1)
  const examDate = new Date(2026, 4, 14)
  const weeksToExam = Math.max(0, Math.ceil((examDate - now) / (7 * 24 * 60 * 60 * 1000)))
  const weeksToPhd = Math.max(0, Math.ceil((new Date(2035, 5, 1) - now) / (7*24*60*60*1000)))

  if (futureOnly) {
    return (
      <div className="hero-stats">
        <div className="hero-stat">
          <div className="label">Weeks Remaining</div>
          <div className="value orange">{weeksLeft.toLocaleString()}</div>
          <div className="sub">to age {LIFE_EXPECTANCY}</div>
        </div>
        <div className="hero-stat">
          <div className="label">Hours This Week</div>
          <div className="value green">168</div>
          <div className="sub">every single week</div>
        </div>
        <div className="hero-stat">
          <div className="label">Weeks to A-Levels</div>
          <div className="value red">{weeksToExam}</div>
          <div className="sub">May 14, 2026</div>
        </div>
        <div className="hero-stat">
          <div className="label">Weeks to UCL</div>
          <div className="value purple">{Math.max(0, Math.ceil((new Date(2027, 8, 1) - now) / (7*24*60*60*1000)))}</div>
          <div className="sub">Sep 2027 entry</div>
        </div>
        <div className="hero-stat">
          <div className="label">Weeks to PhD Done</div>
          <div className="value blue">{weeksToPhd}</div>
          <div className="sub">~Jun 2035</div>
        </div>
        <div className="hero-stat">
          <div className="label">Years of Career</div>
          <div className="value green">31.4</div>
          <div className="sub">after PhD to retirement at 65</div>
        </div>
      </div>
    )
  }

  return (
    <div className="hero-stats">
      <div className="hero-stat">
        <div className="label">Age</div>
        <div className="value blue">{ageYears.toFixed(2)}</div>
        <div className="sub">of {LIFE_EXPECTANCY} years</div>
      </div>
      <div className="hero-stat">
        <div className="label">Weeks Lived</div>
        <div className="value">{weeksLived.toLocaleString()}</div>
        <div className="sub">{pctLived}% of life</div>
      </div>
      <div className="hero-stat">
        <div className="label">Weeks Remaining</div>
        <div className="value orange">{weeksLeft.toLocaleString()}</div>
        <div className="sub">{(100 - pctLived).toFixed(1)}% left</div>
      </div>
      <div className="hero-stat">
        <div className="label">Hours This Week</div>
        <div className="value green">168</div>
        <div className="sub">every single week</div>
      </div>
      <div className="hero-stat">
        <div className="label">Weeks to A-Levels</div>
        <div className="value red">{weeksToExam}</div>
        <div className="sub">May 14, 2026</div>
      </div>
      <div className="hero-stat">
        <div className="label">Weeks to UCL</div>
        <div className="value purple">{Math.max(0, Math.ceil((new Date(2027, 8, 1) - now) / (7*24*60*60*1000)))}</div>
        <div className="sub">Sep 2027 entry</div>
      </div>
    </div>
  )
}

function LifeInWeeks({ futureOnly = false }) {
  const [tooltip, setTooltip] = useState(null)
  const now = new Date()
  const weeksLived = Math.floor((now - BIRTH) / (7 * 24 * 60 * 60 * 1000))
  const currentYear = Math.floor(weeksLived / 52)

  function getPhase(age) {
    return PHASES.find(p => age >= p.start && age < p.end)
  }

  const startYear = futureOnly ? currentYear : 0
  const totalFutureWeeks = (LIFE_EXPECTANCY - currentYear) * 52
  const YEARS_PER_ROW = 18 // ~18 years per row → 5 rows for 90 years. Each row = 18×52 = 936 cells
  const COLS = YEARS_PER_ROW * 52 // 936 weeks per row

  // Build all weeks as a flat array, then chunk into rows
  const allWeeks = useMemo(() => {
    const weeks = []
    for (let year = startYear; year < LIFE_EXPECTANCY; year++) {
      for (let week = 0; week < 52; week++) {
        const weekIndex = year * 52 + week
        const age = year + week / 52
        weeks.push({
          weekIndex, age,
          phase: getPhase(age),
          isPast: weekIndex < weeksLived,
          isCurrent: weekIndex === weeksLived,
          year, week,
          calendarYear: BIRTH.getFullYear() + year,
        })
      }
    }
    return weeks
  }, [weeksLived, startYear])

  // Chunk into rows of COLS weeks
  const rows = useMemo(() => {
    const result = []
    for (let i = 0; i < allWeeks.length; i += COLS) {
      result.push(allWeeks.slice(i, i + COLS))
    }
    return result
  }, [allWeeks])

  // Age labels for each row
  const rowStartAge = (rowIdx) => startYear + rowIdx * YEARS_PER_ROW

  return (
    <div className="card">
      <div className="card-title">
        {futureOnly
          ? `Your Future — ${totalFutureWeeks.toLocaleString()} weeks remaining`
          : `Your Life in Weeks — ${LIFE_EXPECTANCY * 52} weeks, one box each`
        }
      </div>
      <div className="quote">
        {futureOnly
          ? '"Life is forgiving. No matter what happens each week, you get a new fresh box."'
          : '"Those are your weeks and they\'re all you\'ve got."'
        }
        <div className="quote-author">— Tim Urban, Wait But Why</div>
      </div>

      {rows.map((rowWeeks, rowIdx) => {
        const ageStart = rowStartAge(rowIdx)
        const ageEnd = Math.min(ageStart + YEARS_PER_ROW, LIFE_EXPECTANCY)
        return (
          <div key={rowIdx} style={{ marginBottom: 20 }}>
            {/* Age markers for this row */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4, marginLeft: 0 }}>
              {Array.from({ length: ageEnd - ageStart }, (_, i) => {
                const a = ageStart + i
                return (
                  <div key={a} style={{
                    width: `${100 / YEARS_PER_ROW}%`, fontSize: 9, fontWeight: a % 10 === 0 ? 700 : 400,
                    color: a % 10 === 0 ? '#1d1d1f' : a % 5 === 0 ? '#86868b' : 'transparent',
                    textAlign: 'left', fontVariantNumeric: 'tabular-nums',
                  }}>
                    {a % 5 === 0 ? a : '.'}
                  </div>
                )
              })}
            </div>
            {/* Week cells flowing left→right, wrapping every 52 weeks (1 year) */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '1px',
              lineHeight: 0,
            }}>
              {rowWeeks.map(w => (
                <div
                  key={w.weekIndex}
                  style={{
                    width: 6, height: 6, borderRadius: 1,
                    flexShrink: 0,
                    cursor: 'default',
                    background:
                      w.isCurrent ? '#ff3b30' :
                      w.isPast && !futureOnly ? (w.phase?.color || '#ffd60a') :
                      w.isPast && futureOnly ? '#e8e8ed' :
                      w.phase ? w.phase.color : '#e8e8ed',
                    opacity: w.isPast && !futureOnly ? 1 : w.isCurrent ? 1 : 0.6,
                    boxShadow: w.isCurrent ? '0 0 3px rgba(255,59,48,0.6)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    const events = getLeaderEventsAtAge(Math.floor(w.age))
                    setTooltip({
                      x: e.clientX, y: e.clientY,
                      text: `Age ${Math.floor(w.age)} · Week ${w.week + 1} · ${w.calendarYear}${w.phase ? ` · ${w.phase.label}` : ''}${w.isCurrent ? ' · YOU ARE HERE' : ''}${
                        events.length ? '\n' + events.map(ev => `${ev.leader}: ${ev.label} (age ${ev.age})`).join('\n') : ''
                      }`
                    })
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>
          </div>
        )
      })}

      <div className="legend">
        {(futureOnly ? PHASES.filter(p => p.end > currentYear) : PHASES).map(p => (
          <div key={p.id} className="legend-item">
            <div className="legend-color" style={{ background: p.color }} />
            <span>{p.emoji} {p.label}</span>
          </div>
        ))}
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#ff3b30' }} />
          <span>Now</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#e8e8ed', opacity: 0.6 }} />
          <span>{futureOnly ? 'Unplanned' : 'Future'}</span>
        </div>
      </div>
      {tooltip && (
        <div className="tooltip" style={{ left: tooltip.x + 12, top: tooltip.y - 30 }}>
          {tooltip.text}
        </div>
      )}
    </div>
  )
}

function WeeklyPlanner({ week, title, subtitle }) {
  const [tooltip, setTooltip] = useState(null)

  return (
    <div className="card">
      <div className="card-title">{title}</div>
      {subtitle && <p style={{ color: '#86868b', fontSize: 13, marginBottom: 16 }}>{subtitle}</p>}
      <div className="planner-container">
        <div className="planner-grid">
          <div className="planner-header">Time</div>
          {DAYS.map(d => <div key={d} className="planner-header">{d}</div>)}

          {HOURS.map(h => (
            <div key={`row-${h}`} style={{ display: 'contents' }}>
              <div className="planner-time">
                {String(h).padStart(2, '0')}:00
              </div>
              {DAYS.map(d => {
                const act = week[d][h]
                const info = ACTIVITIES[act]
                return (
                  <div
                    key={`${d}-${h}`}
                    className={`planner-cell act-${act}`}
                    onMouseEnter={(e) => setTooltip({
                      x: e.clientX, y: e.clientY,
                      text: `${d} ${String(h).padStart(2,'0')}:00 — ${info.label}`
                    })}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <span className="cell-label">
                      {act !== 'sleep' && act !== 'free' ? info.label : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="legend" style={{ marginTop: 16 }}>
        {Object.entries(ACTIVITIES).map(([k, v]) => (
          <div key={k} className="legend-item">
            <div className="legend-color" style={{ background: v.color, border: k === 'free' ? '1px solid #ddd' : 'none' }} />
            <span>{v.label}</span>
          </div>
        ))}
      </div>
      {tooltip && (
        <div className="tooltip" style={{ left: tooltip.x + 12, top: tooltip.y - 30 }}>
          {tooltip.text}
        </div>
      )}
    </div>
  )
}

function BreakdownBars({ counts, label }) {
  const sorted = Object.entries(counts)
    .filter(([k]) => k !== 'free')
    .sort((a, b) => b[1] - a[1])
  const free = counts.free || 0

  return (
    <div className="card">
      <div className="card-title">{label} — Hour Allocation</div>
      <div className="breakdown-bars">
        {sorted.map(([k, hrs]) => (
          <div key={k} className="breakdown-row">
            <div className="breakdown-label">{ACTIVITIES[k].label}</div>
            <div className="breakdown-bar-bg">
              <div
                className="breakdown-bar-fill"
                style={{
                  width: `${(hrs / 168) * 100}%`,
                  background: ACTIVITIES[k].color,
                  color: ACTIVITIES[k].textColor,
                }}
              >
                {hrs}h
              </div>
            </div>
            <div className="breakdown-hours">{(hrs / 168 * 100).toFixed(0)}%</div>
          </div>
        ))}
        {free > 0 && (
          <div className="breakdown-row">
            <div className="breakdown-label">Unallocated</div>
            <div className="breakdown-bar-bg">
              <div
                className="breakdown-bar-fill"
                style={{ width: `${(free / 168) * 100}%`, background: '#e8e8ed', color: '#86868b' }}
              >
                {free}h
              </div>
            </div>
            <div className="breakdown-hours">{(free / 168 * 100).toFixed(0)}%</div>
          </div>
        )}
      </div>
    </div>
  )
}

function ComparisonView({ currentCounts, idealCounts }) {
  const allKeys = [...new Set([...Object.keys(currentCounts), ...Object.keys(idealCounts)])]
    .filter(k => k !== 'free')
    .sort((a, b) => (idealCounts[b] || 0) - (idealCounts[a] || 0))

  return (
    <div className="card">
      <div className="card-title">Current vs. Ideal — Side by Side</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e8e8ed' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#86868b', fontWeight: 600 }}>Activity</th>
              <th style={{ textAlign: 'center', padding: '8px 12px', color: '#ff3b30', fontWeight: 700 }}>Current</th>
              <th style={{ textAlign: 'center', padding: '8px 12px', color: '#34c759', fontWeight: 700 }}>Ideal</th>
              <th style={{ textAlign: 'center', padding: '8px 12px', color: '#007aff', fontWeight: 700 }}>Delta</th>
            </tr>
          </thead>
          <tbody>
            {allKeys.map(k => {
              const cur = currentCounts[k] || 0
              const ideal = idealCounts[k] || 0
              const delta = ideal - cur
              return (
                <tr key={k} style={{ borderBottom: '1px solid #f0f0f2' }}>
                  <td style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: ACTIVITIES[k]?.color || '#ccc' }} />
                    {ACTIVITIES[k]?.label || k}
                  </td>
                  <td style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{cur}h</td>
                  <td style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{ideal}h</td>
                  <td style={{
                    textAlign: 'center', padding: '8px 12px', fontWeight: 700,
                    color: delta > 0 ? '#34c759' : delta < 0 ? '#ff3b30' : '#86868b',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {delta > 0 ? '+' : ''}{delta}h
                  </td>
                </tr>
              )
            })}
            <tr style={{ borderTop: '2px solid #e8e8ed', fontWeight: 700 }}>
              <td style={{ padding: '8px 12px' }}>Total Allocated</td>
              <td style={{ textAlign: 'center', padding: '8px 12px' }}>{168 - (currentCounts.free || 0)}h</td>
              <td style={{ textAlign: 'center', padding: '8px 12px' }}>{168 - (idealCounts.free || 0)}h</td>
              <td style={{ textAlign: 'center', padding: '8px 12px', color: '#007aff' }}>
                {(currentCounts.free || 0) - (idealCounts.free || 0)}h reclaimed
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MilestoneTimeline({ futureOnly = false }) {
  const items = futureOnly ? MILESTONES.filter(m => !m.done || m.current) : MILESTONES
  return (
    <div className="card">
      <div className="card-title">{futureOnly ? 'Upcoming Milestones' : 'Life Milestones'}</div>
      <p style={{ color: '#86868b', fontSize: 12, marginBottom: 12 }}>
        Colored tags show what leaders were doing at the same age.
      </p>
      <div className="timeline">
        {items.map((m, i) => {
          const leaderEvents = getLeaderEventsAtAge(Math.floor(m.age))
          return (
            <div key={i} className="timeline-item">
              <div className={`timeline-dot ${m.done ? 'past' : m.current ? 'current' : 'future'}`} />
              <div className="timeline-age">Age {m.age}{m.year ? ` (${m.year})` : ''}</div>
              <div className="timeline-title">{m.label}</div>
              {leaderEvents.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                  {leaderEvents.map((e, j) => (
                    <span
                      key={j}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: 10, padding: '2px 8px', borderRadius: 12,
                        background: e.color + '18', color: e.color, fontWeight: 600,
                      }}
                      title={`${e.leader} at age ${e.age}: ${e.label}`}
                    >
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: e.color }} />
                      {e.leader}: {e.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PhilosophyCard() {
  return (
    <div className="card">
      <div className="card-title">The 168 Hours Framework</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: '#1d1d1f' }}>56h</div>
          <div style={{ fontSize: 13, color: '#86868b', marginTop: 4 }}>Sleep (8h/night)</div>
          <div style={{ fontSize: 12, color: '#86868b' }}>33% of your week</div>
        </div>
        <div style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: '#34c759' }}>50h</div>
          <div style={{ fontSize: 13, color: '#86868b', marginTop: 4 }}>Productive work</div>
          <div style={{ fontSize: 12, color: '#86868b' }}>30% of your week</div>
        </div>
        <div style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: '#007aff' }}>62h</div>
          <div style={{ fontSize: 13, color: '#86868b', marginTop: 4 }}>Everything else</div>
          <div style={{ fontSize: 12, color: '#86868b' }}>37% of your week</div>
        </div>
      </div>
      <div className="quote" style={{ marginTop: 16 }}>
        Replace "I don't have time" with "It's not a priority." Every minute is a choice.
        <div className="quote-author">— Laura Vanderkam, 168 Hours</div>
      </div>
    </div>
  )
}

// ── INTERACTIVE LEADER TIMELINE ──
const TIMELINE_PEOPLE = [
  { name: 'You (Phuc)', born: 2001, color: '#007aff',
    spans: [
      { start: 20, end: 24, label: 'Hugging Face', detail: 'Research Engineer — distributed training, Ultra-Scale Playbook' },
      { start: 24, end: 25.8, label: 'Nous Research', detail: 'Research Engineer ($250K/yr) — MoE, CUDA, expert parallelism' },
      { start: 25.8, end: 28.6, label: 'BSc', detail: 'UCL Theoretical Physics BSc (3 years)' },
      { start: 28.8, end: 29.6, label: 'MSc', detail: 'Masters degree (1 year)' },
      { start: 29.8, end: 33.6, label: 'PhD', detail: 'Doctoral research — theoretical physics or AI (4 years)' },
      { start: 33.6, end: 55, label: 'Career', detail: 'Post-PhD career' },
    ]},
  { name: 'Demis Hassabis', born: 1976, color: '#ff9500',
    spans: [
      { start: 18, end: 20, label: 'BSc', detail: 'Cambridge CS — Double First' },
      { start: 29, end: 32, label: 'PhD', detail: 'UCL Cognitive Neuroscience' },
      { start: 34, end: 48, label: 'DeepMind', detail: 'Co-founded DeepMind → Google ($500M) → AlphaGo (39) → AlphaFold (44) → Nobel Prize (48)' },
    ]},
  { name: 'Elon Musk', born: 1971, color: '#ff3b30',
    spans: [
      { start: 21, end: 24, label: 'BSc', detail: 'UPenn — Physics + Economics' },
      { start: 28, end: 30, label: 'PayPal', detail: 'Founded X.com → PayPal → sold to eBay $1.5B' },
      { start: 30, end: 55, label: 'SpaceX + Tesla', detail: 'Founded SpaceX (30), Tesla CEO (37), Falcon 9 (39), Crew Dragon (49)' },
    ]},
  { name: 'Ilya Sutskever', born: 1986, color: '#34c759',
    spans: [
      { start: 16, end: 19, label: 'BSc', detail: 'U of Toronto Mathematics' },
      { start: 19, end: 27, label: 'PhD', detail: 'Toronto under Hinton. AlexNet at 26' },
      { start: 29, end: 37, label: 'OpenAI', detail: 'Co-founded OpenAI as Chief Scientist' },
      { start: 38, end: 55, label: 'SSI', detail: 'Founded Safe Superintelligence Inc.' },
    ]},
  { name: 'Dario Amodei', born: 1983, color: '#ff375f',
    spans: [
      { start: 19, end: 23, label: 'BSc', detail: 'Stanford Physics' },
      { start: 23, end: 28, label: 'PhD', detail: 'Princeton Biophysics' },
      { start: 33, end: 38, label: 'OpenAI', detail: 'VP of Research' },
      { start: 38, end: 55, label: 'Anthropic', detail: 'Co-founded Anthropic. Built Claude' },
    ]},
  { name: 'Jensen Huang', born: 1963, color: '#76b900',
    spans: [
      { start: 18, end: 21, label: 'BSc', detail: 'Oregon State — Electrical Engineering' },
      { start: 30, end: 55, label: 'NVIDIA', detail: 'Co-founded NVIDIA (30), CUDA (43), $3T company (60)' },
    ]},
  { name: 'Mira Murati', born: 1988, color: '#ff6b35',
    spans: [
      { start: 18, end: 23, label: 'BSc', detail: 'Dartmouth BEng Mechanical Engineering' },
      { start: 29, end: 36, label: 'OpenAI', detail: 'CTO of OpenAI (33). Shipped ChatGPT (34)' },
      { start: 36, end: 55, label: 'Thinking Machines', detail: 'Founded Thinking Machines Lab ($12B valuation)' },
    ]},
  { name: 'Philip Johnston', born: 1986, color: '#00c7be',
    spans: [
      { start: 18, end: 22, label: 'BSc', detail: 'Nottingham — Applied Math & Theoretical Physics' },
      { start: 37, end: 55, label: 'Starcloud', detail: 'Co-founded Starcloud (space data centers). First H100 in orbit (39)' },
    ]},
  { name: 'Max Hodak', born: 1989, color: '#e040fb',
    spans: [
      { start: 18, end: 22, label: 'BSc', detail: 'Duke — Biomedical Engineering' },
      { start: 27, end: 31, label: 'Neuralink', detail: 'Co-founded Neuralink as President' },
      { start: 31, end: 55, label: 'Science Corp', detail: 'Founded Science Corp — PRIMA retinal implant, FDA Breakthrough (34)' },
    ]},
  { name: 'DJ Seo', born: 1989, color: '#b388ff',
    spans: [
      { start: 18, end: 22, label: 'BSc', detail: 'Caltech — Electrical Engineering' },
      { start: 22, end: 27, label: 'PhD', detail: 'UC Berkeley EECS — Neural Dust' },
      { start: 27, end: 55, label: 'Neuralink', detail: 'Co-founded Neuralink. President & COO' },
    ]},
  { name: 'Jared Kaplan', born: 1983, color: '#ff7043',
    spans: [
      { start: 18, end: 22, label: 'BSc', detail: 'Stanford — Physics + Mathematics' },
      { start: 22, end: 26, label: 'PhD', detail: 'Harvard Physics — "Aspects of Holography" under Arkani-Hamed' },
      { start: 26, end: 36, label: 'Academic', detail: 'SLAC postdoc → JHU Professor. Sloan Fellowship (31)' },
      { start: 36, end: 55, label: 'Anthropic', detail: 'OpenAI (36) → Scaling Laws paper (37) → Co-founded Anthropic (38)' },
    ]},
  { name: 'Jeremy Howard', born: 1973, color: '#8d6e63',
    spans: [
      { start: 18, end: 20, label: 'BA', detail: 'Melbourne — Philosophy. No technical degree' },
      { start: 18, end: 25, label: 'McKinsey', detail: 'Hired at 18 while still a student. Only analytical specialist in Asia-Pacific' },
      { start: 25, end: 37, label: 'Startups', detail: 'Founded FastMail (25). #1 Kaggle globally (37)' },
      { start: 42, end: 55, label: 'fast.ai', detail: 'Co-founded fast.ai (42). ULMFiT (44). Answer.AI (50)' },
    ]},
  { name: 'Max Tegmark', born: 1967, color: '#7e57c2',
    spans: [
      { start: 22, end: 23, label: 'BSc', detail: 'KTH Stockholm — Physics' },
      { start: 23, end: 27, label: 'PhD', detail: 'UC Berkeley — Physics' },
      { start: 31, end: 37, label: 'UPenn', detail: 'Assistant → tenured Professor' },
      { start: 37, end: 55, label: 'MIT', detail: 'MIT Professor (37). Future of Life Institute (46). Life 3.0 (50)' },
    ]},
  { name: 'Deblina Sarkar', born: 1986, color: '#f06292',
    spans: [
      { start: 18, end: 22, label: 'B.E.', detail: 'IIT Dhanbad — Electronics & Communication Engineering' },
      { start: 22, end: 29, label: 'MS+PhD', detail: 'UCSB — 6-atom transistor in Nature (29). IEEE PhD Fellow' },
      { start: 29, end: 34, label: 'Postdoc', detail: 'MIT Synthetic Neurobiology (Boyden). NIH K99 Award' },
      { start: 34, end: 55, label: 'MIT Professor', detail: 'MIT Media Lab. Founded Nano-Cybernetic Biotrek Lab. IEEE Nano Award (36)' },
    ]},
  { name: 'Jared Isaacman', born: 1983, color: '#546e7a',
    spans: [
      { start: 16, end: 37, label: 'Shift4', detail: 'Founded at 16 from parents\' basement. No degree. IPO at 37 ($345M)' },
      { start: 38, end: 42, label: 'SpaceX missions', detail: 'Inspiration4 (38). Polaris Dawn + first private spacewalk (41)' },
      { start: 42, end: 55, label: 'NASA Admin', detail: '15th NASA Administrator. Confirmed by Senate Dec 2025' },
    ]},
  { name: 'Peter Beck', born: 1977, color: '#e53935',
    spans: [
      { start: 16, end: 19, label: 'Apprentice', detail: 'Fisher & Paykel — precision engineering. No university degree' },
      { start: 29, end: 55, label: 'Rocket Lab', detail: 'Founded Rocket Lab (29). First orbital launch (41). IPO $4.8B (44). Knighted (47). 66+ launches' },
    ]},
]

const AXIS_MIN = 15
const AXIS_MAX = 55
const AXIS_RANGE = AXIS_MAX - AXIS_MIN

function LeaderTimeline() {
  const [tooltip, setTooltip] = useState(null)

  return (
    <div className="card">
      <div className="card-title">Timeline Comparison — You vs. AI & Space Leaders</div>
      <p style={{ color: '#86868b', fontSize: 13, marginBottom: 12 }}>
        Hover any segment to see details. Each bar is scaled by age (15–55).
      </p>

      {/* Top age axis */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ width: 120, flexShrink: 0, fontSize: 10, color: '#86868b', textAlign: 'right', fontWeight: 600 }}>AGE →</span>
        <div style={{ flex: 1, position: 'relative', height: 20 }}>
          {[15, 20, 25, 30, 35, 40, 45, 50, 55].map(a => (
            <div key={a} style={{
              position: 'absolute', left: `${((a - AXIS_MIN) / AXIS_RANGE) * 100}%`,
              transform: 'translateX(-50%)', fontSize: 10, fontWeight: 600, color: '#1d1d1f',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {a}
            </div>
          ))}
        </div>
      </div>

      {/* Gridlines + bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {TIMELINE_PEOPLE.map(person => (
          <div key={person.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 120, fontSize: 11, fontWeight: 700, color: person.color,
              textAlign: 'right', flexShrink: 0, lineHeight: 1.2,
            }}>
              {person.name}
              <span style={{ display: 'block', fontSize: 9, fontWeight: 400, color: '#86868b' }}>b. {person.born}</span>
            </span>
            <div style={{
              flex: 1, height: 28, background: '#f5f5f7', borderRadius: 6,
              position: 'relative', overflow: 'visible',
            }}>
              {/* Vertical gridlines */}
              {[20, 25, 30, 35, 40, 45, 50].map(a => (
                <div key={a} style={{
                  position: 'absolute', left: `${((a - AXIS_MIN) / AXIS_RANGE) * 100}%`,
                  top: 0, bottom: 0, width: 1, background: '#e8e8ed', zIndex: 0,
                }} />
              ))}
              {/* Spans */}
              {person.spans.map((s, i) => {
                const left = ((s.start - AXIS_MIN) / AXIS_RANGE) * 100
                const width = ((s.end - s.start) / AXIS_RANGE) * 100
                const isYou = person.name.startsWith('You')
                return (
                  <div
                    key={i}
                    onMouseEnter={(e) => setTooltip({
                      x: e.clientX, y: e.clientY,
                      name: person.name,
                      color: person.color,
                      label: s.label,
                      ages: `Age ${s.start}–${s.end} (${(s.end - s.start).toFixed(1)} yr)`,
                      detail: s.detail,
                    })}
                    onMouseMove={(e) => setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      position: 'absolute',
                      left: `${Math.max(0, left)}%`,
                      width: `${width}%`,
                      height: '100%',

                      background: person.color,
                      opacity: 0.85,
                      borderRadius: 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9,
                      fontWeight: 700, color: '#fff',
                      overflow: 'visible', whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      zIndex: 2,
                      transition: 'opacity 0.15s',
                      border: isYou ? '2px solid #007aff' : 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span style={{
                      pointerEvents: 'none',
                      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                      padding: '0 2px',
                    }}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom age axis */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <span style={{ width: 120, flexShrink: 0 }} />
        <div style={{ flex: 1, position: 'relative', height: 20 }}>
          {[15, 20, 25, 30, 35, 40, 45, 50, 55].map(a => (
            <div key={a} style={{
              position: 'absolute', left: `${((a - AXIS_MIN) / AXIS_RANGE) * 100}%`,
              transform: 'translateX(-50%)', fontSize: 10, fontWeight: 600, color: '#1d1d1f',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {a}
            </div>
          ))}
        </div>
      </div>

      {/* Key insight */}
      <div style={{ marginTop: 24, padding: 16, background: '#f0f7ff', borderRadius: 12, fontSize: 13, lineHeight: 1.6 }}>
        <strong>Key patterns:</strong> Most founded their major ventures in their <strong>mid-30s</strong> (Hassabis 34, Amodei 38, Murati 36, Johnston 37). Musk and Huang are outliers at 30 — both skipped PhDs. Hassabis started his PhD at 29, finished at 32, founded DeepMind at 34 — nearly identical to your timeline (PhD 30→34, venture at ~34).
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="tooltip" style={{ left: tooltip.x + 16, top: tooltip.y - 60 }}>
          <div style={{ fontWeight: 700, color: tooltip.color, marginBottom: 2 }}>{tooltip.name}</div>
          <div style={{ fontWeight: 700 }}>{tooltip.label}</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>{tooltip.ages}</div>
          <div style={{ marginTop: 4, fontSize: 11, lineHeight: 1.4 }}>{tooltip.detail}</div>
        </div>
      )}
    </div>
  )
}

function NeitherWeeksCard({ idealCounts, currentCounts }) {
  const currentWaste = (currentCounts.leisure || 0) + (currentCounts.free || 0)
  const idealFree = (idealCounts.leisure || 0) + (idealCounts.free || 0)
  const recovered = currentWaste - idealFree

  return (
    <div className="card">
      <div className="card-title">The "Neither Weeks" Problem</div>
      <p style={{ fontSize: 14, color: '#1d1d1f', lineHeight: 1.6, marginBottom: 16 }}>
        Tim Urban divides weeks into three types: <strong>Enjoying</strong> (present joy),{' '}
        <strong>Building</strong> (investing in future), and <strong>Neither</strong> (wasted on neither).
      </p>
      <div className="hero-stats" style={{ marginBottom: 0 }}>
        <div className="hero-stat">
          <div className="label">Current "Neither" Hours</div>
          <div className="value red">{currentWaste}h</div>
          <div className="sub">per week wasted</div>
        </div>
        <div className="hero-stat">
          <div className="label">Ideal Free Time</div>
          <div className="value green">{idealFree}h</div>
          <div className="sub">intentional leisure</div>
        </div>
        <div className="hero-stat">
          <div className="label">Hours Recovered</div>
          <div className="value blue">{recovered}h</div>
          <div className="sub">redirected to building</div>
        </div>
      </div>
    </div>
  )
}

function LifeRoadmap({ scenario = 'current' }) {
  const is2028 = scenario === '2028'
  const phases = is2028 ? ROADMAP_2028_PHASES : ROADMAP_PHASES
  const totalSpan = ROADMAP_END_AGE - ROADMAP_START_AGE // 40.7 years
  const totalWeeks = Math.round(totalSpan * 52)
  const totalHours = Math.round(totalSpan * 365.25 * 24)

  // Education subtotal (A-levels + BSc + Masters + PhD)
  const educationIds = is2028 ? ['undergrad','masters','phd'] : ['alevels','bsc','masters','phd']
  const eduPhases = phases.filter(p => educationIds.includes(p.id))
  const eduYears = eduPhases.reduce((s, p) => s + (p.endAge - p.startAge), 0)
  const eduWeeks = Math.round(eduYears * 52)
  const eduHours = Math.round(eduYears * 365.25 * 24)
  const eduPct = (eduYears / totalSpan * 100)

  // Career
  const careerPhase = phases.find(p => p.id === 'career')
  const careerYears = ROADMAP_END_AGE - careerPhase.startAge
  const careerPct = (careerYears / totalSpan * 100)

  // Gap years between phases
  const gaps = []
  for (let i = 0; i < phases.length - 1; i++) {
    const gap = phases[i + 1].startAge - phases[i].endAge
    if (gap > 0.05) gaps.push({ years: gap })
  }
  const gapYears = gaps.reduce((s, g) => s + g.years, 0)

  const TH = { textAlign: 'center', padding: '10px 12px', color: '#86868b', fontWeight: 600, fontSize: 12 }
  const TD = { textAlign: 'center', padding: '10px 12px', fontVariantNumeric: 'tabular-nums' }

  return (
    <div>
      {/* Hero stats */}
      <div className="hero-stats">
        <div className="hero-stat">
          <div className="label">Time Span</div>
          <div className="value blue">{totalSpan.toFixed(1)}</div>
          <div className="sub">years (age 24 → 65)</div>
        </div>
        <div className="hero-stat">
          <div className="label">Total Weeks</div>
          <div className="value">{totalWeeks.toLocaleString()}</div>
          <div className="sub">in this window</div>
        </div>
        <div className="hero-stat">
          <div className="label">Total Education</div>
          <div className="value orange">{is2028 ? '8–10 yr' : `${eduYears.toFixed(1)} yr`}</div>
          <div className="sub">{is2028 ? 'undergrad + master + PhD · excludes career' : `${eduPct.toFixed(1)}% of window · through PhD only`}</div>
        </div>
        <div className="hero-stat">
          <div className="label">Career After PhD</div>
          <div className="value green">{is2028 ? '28.2–30.2 yr' : `${careerYears.toFixed(1)} yr`}</div>
          <div className="sub">{is2028 ? 'to retirement at 65, depending on PhD length' : `${careerPct.toFixed(1)}% of window`}</div>
        </div>
      </div>

      {/* ═══ TIMELINE BAR ═══ */}
      <div className="card">
        <div className="roadmap-title-row">
          <div className="card-title">Life Roadmap — Age 24 to 65</div>
          <div className="roadmap-updated">Updated: 24 Aug 2026</div>
        </div>
        <p style={{ color: '#86868b', fontSize: 13, marginBottom: 20 }}>
          {is2028
            ? '2028 route: 3-year undergraduate → 2-year master → 3–5-year PhD. The bar uses a 4-year PhD midpoint.'
            : 'Each segment is proportional to its real duration. Hover for details.'}
        </p>

        {/* Timeline bar with labels below */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', height: 56 }}>
            {phases.map((p, i) => {
              const dur = p.endAge - p.startAge
              const pct = (dur / totalSpan) * 100
              const prevEnd = i > 0 ? phases[i-1].endAge : ROADMAP_START_AGE
              const gapBefore = p.startAge - prevEnd
              const gapPct = (gapBefore / totalSpan) * 100
              return (
                <div key={p.id} style={{ display: 'contents' }}>
                  {gapBefore > 0.05 && (
                    <div style={{ width: `${gapPct}%`, background: '#f0f0f2' }} title={`Gap: ${(gapBefore * 12).toFixed(0)} months`} />
                  )}
                  <div
                    style={{
                      width: `${pct}%`, background: p.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: pct > 10 ? 12 : 10, fontWeight: 700,
                      cursor: 'default',
                    }}
                    title={`${p.label}: ${p.durationLabel || `${dur.toFixed(1)} yr`} — ${p.startDate} to ${p.endDate}`}
                  >
                    {pct > 15 ? `${p.emoji} ${p.label}` : pct > 5 ? p.emoji : ''}
                  </div>
                </div>
              )
            })}
          </div>
          {/* Labels below the bar */}
          <div style={{ display: 'flex', marginTop: 6 }}>
            {phases.map((p, i) => {
              const dur = p.endAge - p.startAge
              const pct = (dur / totalSpan) * 100
              const prevEnd = i > 0 ? phases[i-1].endAge : ROADMAP_START_AGE
              const gapBefore = p.startAge - prevEnd
              const gapPct = (gapBefore / totalSpan) * 100
              return (
                <div key={p.id} style={{ display: 'contents' }}>
                  {gapBefore > 0.05 && <div style={{ width: `${gapPct}%` }} />}
                  <div style={{ width: `${pct}%`, textAlign: 'center', fontSize: 9, color: '#86868b', lineHeight: 1.3 }}>
                    <div style={{ fontWeight: 600 }}>{p.durationLabel || `${dur.toFixed(1)} yr`}</div>
                    <div>{p.pctLabel || `${pct.toFixed(0)}%`}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detailed table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e8e8ed' }}>
                <th style={{ ...TH, textAlign: 'left', minWidth: 180 }}>Phase</th>
                <th style={TH}>Dates</th>
                <th style={TH}>Age</th>
                <th style={TH}>Duration</th>
                <th style={TH}>Weeks</th>
                <th style={TH}>% of 24→65</th>
                <th style={{ ...TH, minWidth: 100 }}>Bar</th>
              </tr>
            </thead>
            <tbody>
              {phases.map(p => {
                const dur = p.endAge - p.startAge
                const pct = (dur / totalSpan) * 100
                const weeks = Math.round(dur * 52)
                return (
                  <Fragment key={p.id}>
                  {p.id === 'career' && (
                    <tr style={{ borderTop: '2px solid #007aff', background: '#f0f7ff' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#007aff' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 10, height: 10, borderRadius: 3, background: 'linear-gradient(135deg, #007aff, #5856d6)', display: 'inline-block' }} />
                          Total Education — through PhD only
                        </span>
                      </td>
                      <td style={{ ...TD, color: '#86868b', fontSize: 11 }}>{is2028 ? 'Sep 2028 → Jun 2036–38' : 'Mar 2026 → Jun 2035'}</td>
                      <td style={{ ...TD, fontSize: 11 }}>{is2028 ? '26.8 → 34.8–36.8' : '24.3 → 33.6'}</td>
                      <td style={{ ...TD, fontWeight: 800, color: '#007aff' }}>{is2028 ? '8–10 yr' : `${eduYears.toFixed(1)} yr`}</td>
                      <td style={{ ...TD, fontWeight: 700 }}>{is2028 ? '416–520' : eduWeeks}</td>
                      <td style={{ ...TD, fontWeight: 800, color: '#ff9500' }}>{is2028 ? '19.7–24.6%' : `${eduPct.toFixed(1)}%`}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ background: '#f0f0f2', borderRadius: 4, height: 14, overflow: 'hidden' }}>
                          <div style={{ width: `${eduPct}%`, height: '100%', background: 'linear-gradient(90deg, #007aff, #5856d6)', borderRadius: 4 }} />
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr style={{ borderBottom: '1px solid #f0f0f2' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: p.color, display: 'inline-block', flexShrink: 0 }} />
                        {p.emoji} {p.label}
                      </span>
                    </td>
                    <td style={{ ...TD, color: '#86868b', fontSize: 11 }}>{p.startDate} → {p.endDate}</td>
                    <td style={{ ...TD, fontSize: 11 }}>{p.ageLabel || `${p.startAge.toFixed(1)} → ${p.endAge.toFixed(1)}`}</td>
                    <td style={{ ...TD, fontWeight: 700 }}>{p.durationLabel || `${dur.toFixed(1)} yr`}</td>
                    <td style={TD}>{p.weeksLabel || weeks.toLocaleString()}</td>
                    <td style={{ ...TD, fontWeight: 700, color: p.color }}>{p.pctLabel || `${pct.toFixed(1)}%`}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ background: '#f0f0f2', borderRadius: 4, height: 14, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: p.color, borderRadius: 4, minWidth: 2 }} />
                      </div>
                    </td>
                  </tr>
                  </Fragment>
                )
              })}
              {/* Gaps row */}
              {gapYears > 0.05 && (
                <tr style={{ borderBottom: '1px solid #f0f0f2', color: '#86868b' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: '#e8e8ed', display: 'inline-block' }} />
                      Gaps / Summers
                    </span>
                  </td>
                  <td style={TD}>—</td>
                  <td style={TD}>—</td>
                  <td style={{ ...TD, fontWeight: 700 }}>{gapYears.toFixed(1)} yr</td>
                  <td style={TD}>{Math.round(gapYears * 52)}</td>
                  <td style={TD}>{(gapYears / totalSpan * 100).toFixed(1)}%</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ background: '#f0f0f2', borderRadius: 4, height: 14 }} />
                  </td>
                </tr>
              )}
              {/* Grand total */}
              <tr style={{ borderTop: '2px solid #1d1d1f', fontWeight: 700 }}>
                <td style={{ padding: '10px 12px' }}>Total</td>
                <td style={{ ...TD, fontSize: 11 }}>Mar 2026 → 2066</td>
                <td style={{ ...TD, fontSize: 11 }}>24.3 → 65</td>
                <td style={TD}>{totalSpan.toFixed(1)} yr</td>
                <td style={TD}>{totalWeeks.toLocaleString()}</td>
                <td style={TD}>100%</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ EDUCATION VS CAREER ═══ */}
      <div className="card">
        <div className="card-title">Education vs. Career — Investment Ratio</div>

        {/* Two-block visual */}
        <div style={{ display: 'flex', gap: 2, borderRadius: 12, overflow: 'hidden', height: 48, marginBottom: 20 }}>
          <div style={{
            width: `${eduPct}%`, background: 'linear-gradient(135deg, #007aff, #5856d6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 13,
          }}>
            Education ({is2028 ? '9 yr midpoint' : `${eduYears.toFixed(1)} yr`})
          </div>
          {gapYears > 0.05 && (
            <div style={{
              width: `${(gapYears / totalSpan * 100)}%`, background: '#e8e8ed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#86868b', fontSize: 9, fontWeight: 600,
            }} />
          )}
          <div style={{
            width: `${careerPct}%`, background: 'linear-gradient(135deg, #af52de, #ff375f)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 13,
          }}>
            Career ({is2028 ? '29.2 yr midpoint' : `${careerYears.toFixed(1)} yr`})
          </div>
        </div>

        <p style={{ fontSize: 14, color: '#1d1d1f', lineHeight: 1.6, marginBottom: 20 }}>
          <strong>1 : {(careerYears / eduYears).toFixed(1)}</strong> investment ratio —
          every year of education yields {(careerYears / eduYears).toFixed(1)} years of empowered career.
          {' '}{eduPct.toFixed(0)}% education → {careerPct.toFixed(0)}% career.
          {is2028 && ' Midpoint display: a 4-year PhD; the real completion range is 2036–38.'}
        </p>

        {/* Key numbers */}
        <div className="hero-stats" style={{ marginBottom: 0 }}>
          <div className="hero-stat">
            <div className="label">{is2028 ? 'Runway to 2028' : 'A-Levels'}</div>
            <div className="value" style={{ color: '#30d158', fontSize: 28 }}>{is2028 ? '2.5 yr' : '1.5 yr'}</div>
            <div className="sub">{((is2028 ? 2.5 : 1.5) / totalSpan * 100).toFixed(1)}%</div>
          </div>
          <div className="hero-stat">
            <div className="label">{is2028 ? 'Undergraduate' : 'BSc'}</div>
            <div className="value" style={{ color: '#007aff', fontSize: 28 }}>3 yr</div>
            <div className="sub">{(3 / totalSpan * 100).toFixed(1)}%</div>
          </div>
          <div className="hero-stat">
            <div className="label">Master</div>
            <div className="value" style={{ color: '#0071e3', fontSize: 28 }}>{is2028 ? '2 yr' : '1 yr'}</div>
            <div className="sub">{((is2028 ? 2 : 1) / totalSpan * 100).toFixed(1)}%</div>
          </div>
          <div className="hero-stat">
            <div className="label">PhD</div>
            <div className="value" style={{ color: '#5856d6', fontSize: 28 }}>{is2028 ? '3–5 yr' : '4 yr'}</div>
            <div className="sub">{is2028 ? '7.4–12.3%' : `${(4 / totalSpan * 100).toFixed(1)}%`}</div>
          </div>
          <div className="hero-stat">
            <div className="label">Career</div>
            <div className="value" style={{ color: '#af52de', fontSize: 28 }}>{is2028 ? '28.2–30.2 yr' : '31.4 yr'}</div>
            <div className="sub">{is2028 ? '69.3–74.2%' : `${careerPct.toFixed(1)}%`}</div>
          </div>
        </div>
      </div>

      {/* ═══ LEADERS COMPARISON (interactive) ═══ */}
      <LeaderTimeline />
    </div>
  )
}

// ── MAIN APP ──
export default function App() {
  const [roadmapView, setRoadmapView] = useState('roadmap')
  const [roadmapScenario, setRoadmapScenario] = useState('2028')

  return (
    <div className="app">
      <div className="header">
        <h1>Life Roadmap</h1>
        <p>Education, career, citizenship, relationships, family, and the route to retirement at 65.</p>
      </div>

      <div className="roadmap-subnav life-view-nav" aria-label="Life Roadmap views">
        <button
          className={roadmapView === 'roadmap' ? 'active' : ''}
          onClick={() => setRoadmapView('roadmap')}
        >
          Roadmap
        </button>
        <button
          className={roadmapView === 'timeline' ? 'active' : ''}
          onClick={() => setRoadmapView('timeline')}
        >
          Timeline &amp; Citizenship
        </button>
        <button
          className={roadmapView === 'family' ? 'active' : ''}
          onClick={() => setRoadmapView('family')}
        >
          Relationship &amp; Family
        </button>
      </div>

      {roadmapView === 'roadmap' ? (
        <>
          <div className="roadmap-subnav roadmap-scenario-nav" aria-label="Roadmap versions">
            <button
              className={roadmapScenario === '2028' ? 'active' : ''}
              onClick={() => setRoadmapScenario('2028')}
            >
              2028 · 3y UG → 2y Master → 3–5y PhD
            </button>
            <button
              className={roadmapScenario === 'current' ? 'active' : ''}
              onClick={() => setRoadmapScenario('current')}
            >
              Original 2027 route
            </button>
          </div>
          <LifeRoadmap scenario={roadmapScenario} />
          {roadmapScenario === 'current' && (
            <>
              <LifeInWeeks futureOnly={false} />
              <MilestoneTimeline futureOnly={false} />
            </>
          )}
        </>
      ) : roadmapView === 'timeline' ? (
        <InlineTimelineCitizenship />
      ) : (
        <RelationshipFamilyTimeline />
      )}
    </div>
  )
}

