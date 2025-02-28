import HorizontalStack from "../HorizontalStack";
import "./index.scss";

const Modal = ({ title,  show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <HorizontalStack justifyContent="flex-start">
          <h2>{title}</h2>
        </HorizontalStack>

        {children}

        <HorizontalStack justifyContent="flex-end">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </HorizontalStack>
      </div>
    </div>
  );
};

export default Modal;
