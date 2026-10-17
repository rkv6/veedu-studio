import { useEffect, useRef } from 'react'
import { RoomArt } from './Art'
import type { Project } from './data'

export function ProjectDialog({ project, onClose, onEnquire }: { project: Project | null; onClose: () => void; onEnquire: (p: Project) => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current!
    if (project && !d.open) d.showModal()
    if (!project && d.open) d.close()
  }, [project])

  return (
    <dialog ref={ref} className="detail" data-lenis-prevent onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose() }} aria-labelledby="detail-title">
      {project && (
        <div className="detail-grid">
          <div className="detail-art"><RoomArt kind={project.kind} /></div>
          <div className="detail-body">
            <button className="detail-close" onClick={onClose} aria-label="Close project details">×</button>
            <h3 id="detail-title">{project.name}</h3>
            <p className="where">{project.place}, {project.scope}</p>
            <dl className="detail-facts">
              <div><dt>Finished</dt><dd>{project.done}</dd></div>
              <div><dt>Took</dt><dd>{project.took}</dd></div>
              <div><dt>Area</dt><dd>{project.area}</dd></div>
              <div><dt>Budget</dt><dd>{project.budget}</dd></div>
            </dl>
            <p className="detail-brief">{project.brief}</p>
            <ul className="detail-list">
              {project.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
            <button className="btn" onClick={() => onEnquire(project)}>Plan something like this</button>
          </div>
        </div>
      )}
    </dialog>
  )
}
