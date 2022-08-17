import './ReconcilationDetail.scss';
import { useLocation, Navigate, Link, useNavigate } from 'react-router-dom';
import { BackButton } from '@comp/core/buttons';

const missingRoutes = {
  city(docId) {
    return `/city24/transactions/id/${docId}`;
  },
  paytech(docId) {
    return `/transactions/${docId}`;
  }
};

const ReconcilationDetail = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const { state } = location;
  if (!state) {
    return <Navigate to={`/reconciliation`} />;
  }
  return (
    <div className="reconcilation__container">
      <BackButton action={() => navigate(`/reconciliation`)} />
      {Object.keys(state.detail).map((recItemKey) => (
        <div key={recItemKey} className="reconcilation__item">
          <div className="reconcilation__head-wrap">
            <div className="reconcilation__head reconcilation__name">
              <span className="reconcilation__head-title">Name:</span>
              <span>{recItemKey}</span>
            </div>
            <div className="reconcilation__head reconcilation__amount">
              <span className="reconcilation__head-title">Amount:</span>
              <span>{state.detail[recItemKey].amount}</span>
            </div>
            <div className="reconcilation__head reconcilation__total-count">
              <span className="reconcilation__head-title">Total Count:</span>
              <span>{state.detail[recItemKey].totalCount}</span>
            </div>
          </div>

          <ul className="reconcilation__missing-list">
            {state.detail[recItemKey].missing.map((missingItem, idx) => (
              <li
                className="reconcilation__missing-list-item"
                key={missingItem + idx}
              >
                {recItemKey === 'bank' ? (
                  missingItem
                ) : (
                  <Link
                    className="reconcilation__link"
                    to={missingRoutes[recItemKey](missingItem)}
                  >
                    {missingItem}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ReconcilationDetail;
