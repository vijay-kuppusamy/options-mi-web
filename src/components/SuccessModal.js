import { useNavigate } from 'react-router-dom';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const SuccessModal = ({ setShow, title, message }) => {
  //
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
      <Modal show={() => setShow(false)} onHide={handleClose}>
        <Modal.Body>
          <button
            type="button"
            onClick={handleClose}
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
          <div className="modal-status bg-success"></div>
          <div className="modal-body text-center py-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon mb-2 text-green icon-lg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="12" r="9" />
              <path d="M9 12l2 2l4 -4" />
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
              <div class="col">
                <Button className="btn btn-success w-100" onClick={goToLogin}>
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

export default SuccessModal;
