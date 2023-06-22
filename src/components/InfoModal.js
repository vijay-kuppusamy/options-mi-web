import { useNavigate } from "react-router-dom";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

/**
 Usage :

 const [show, setShow] = useState(false);
 const showModal = () => {
    setShow(true);
 };
 
<button onClick={showModal}> Show Modal</button>
{show && <InfoModal setShow={setShow} title="Title" message="Message !." />}

 */

const InfoModal = ({ setShow, title, message }) => {
  const navigate = useNavigate();

  const handleClose = () => setShow(false);

  const goToHome = () => {
    handleClose();
    navigate("/");
  };
  const goToLogin = () => {
    handleClose();
    navigate("/login");
  };

  return (
    <>
      <Modal
        show={() => setShow(false)}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <div className="modal-status bg-info" />
          <div className="modal-body text-center py-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon mb-2 text-info icon-lg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
              <polyline points="11 12 12 12 12 16 13 16" />
            </svg>
            <h3>{title}</h3>
            <div className="text-muted">{message}</div>
          </div>
          <Modal.Footer>
            <div className="row w-100">
              <div className="col">
                <Button className="btn btn-secondary w-100" onClick={goToHome}>
                  Home
                </Button>
              </div>
              <div className="col">
                <Button className="btn btn-info w-100" onClick={goToLogin}>
                  Login
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default InfoModal;
