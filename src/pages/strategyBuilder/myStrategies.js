import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IconNotes } from '@tabler/icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { setStrategy } from '../../features/strategyBuilder/strategyBuilderSlice';
import optionChainService from '../../features/optionChain/optionChainService';
import { setOptionChain } from '../../features/optionChain/optionChainSlice';

const MyStrategies = () => {
  //
  const dispatch = useDispatch();
  //
  const symbol = useSelector((state) => state.optionChain.symbol);
  const expiry = useSelector((state) => state.optionChain.expiry);
  const expiryDates = useSelector((state) => state.optionChain.expiryDates);

  const strategies = useSelector((state) => state.strategyBuilder.strategies);

  // Modal Start
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [notes, setSetNotes] = useState('');

  const showNotes = (notes) => {
    setSetNotes(notes);
    handleShow();
  };
  // Modal End

  const getStrategyDetails = (strategy) => {
    let query = { symbol: '', expiry: '' };
    if (strategy && strategy.positions && strategy.positions.length > 0) {
      let position = strategy.positions[0];
      query.symbol = position.symbol;
      query.expiry = expiryDates[position.expirySteps];
    }
    return query;
  };

  const getStrategy = (index) => {
    const strategy = strategies[index];
    let query = getStrategyDetails(strategy);
    if (symbol !== query.symbol || expiry !== query.expiry) {
      optionChainService
        .getOptionChain({})
        .then((response) => {
          dispatch(setOptionChain(response));
          dispatch(setStrategy({ strategy }));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      dispatch(setStrategy({ strategy }));
    }
  };

  return (
    <div>
      <div className="card mt-2">
        <div className="card-header">
          <h3 className="card-title">My Strategies</h3>
        </div>
        <div className="card-body border-bottom py-3">
          <div className="table-responsive strategy-table mb-3">
            <table className="table table-sm table-hover table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {strategies &&
                  strategies.map((strategy, index) => (
                    <tr key={index}>
                      <td>{strategy.name}</td>
                      <td>
                        <IconNotes
                          className="strategy-notes"
                          onClick={() => showNotes(strategy.notes)}
                        />
                      </td>
                      <td>
                        <Button
                          onClick={() => getStrategy(index)}
                          variant="btn btn-outline-primary"
                          size="sm"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Notes Modal start */}
      <div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Notes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <span>{notes}</span>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-primary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/* Notes Modal End */}
    </div>
  );
};

export default MyStrategies;
