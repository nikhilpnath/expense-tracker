// esling warning remove
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

interface PropsType {
  children: React.ReactNode;
  onClose: () => void;
}

function Modal({ children, onClose }: PropsType) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <dialog
        className="modal"
        open
        onClick={(event: React.MouseEvent<HTMLDialogElement, MouseEvent>) =>
          event.stopPropagation()
        }
      >
        {children}
      </dialog>
    </div>
  );
}

export default Modal;
