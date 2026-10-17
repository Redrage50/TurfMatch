export default function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: 19 }}>{title}</h3>
        <div className="mt-16">{children}</div>
      </div>
    </div>
  );
}
