import { useNavigate } from 'react-router-dom';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

/**
 Usage :

 const [show, setShow] = useState(false);
 const showModal = () => {
    setShow(true);
 };
 
<button onClick={showModal}> Show Modal</button>
{show && <ErrorModal setShow={setShow} title="Title" message="Message !." />}

 */

const ErrorModal = ({ setShow, title, message }) => {
  const navigate = useNavigate();

  const handleClose = () => setShow(false);

  const goToHome = () => {
    handleClose();
    navigate('/');
  };
  const goToLogin = () => {
    handleClose();
    navigate('/login');
  };

  return (
    <>
      <Modal show={() => setShow(false)} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Body>
          <div className="modal-status bg-danger" />
          <div className="modal-body text-center py-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon mb-2 text-danger icon-lg"
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
              <path d="M12 9v2m0 4v.01" />
              <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
            </svg>
            <h3>{title}</h3>
            <div className="text-muted">{message}</div>
          </div>
          <Modal.Footer>
            <div className="row w-100">
              <div className="col">
                <Button className="btn btn-primary w-100" onClick={goToHome}>
                  Home
                </Button>
              </div>
              <div className="col">
                <Button className="btn btn-danger w-100" onClick={goToLogin}>
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

export default ErrorModal;
