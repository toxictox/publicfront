import './ReconcilationDetail.scss';
import { useLocation, Navigate, Link, useNavigate } from 'react-router-dom';
import { BackButton } from '@comp/core/buttons';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

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
  const { t } = useTranslation();
  const { state } = location;
  if (!state) {
    return <Navigate to={`/reconciliation`} />;
  }

  const getReconcilationMissingList = (missingList, recItemKey) => {
    const recList = missingList || {};
    return Object.keys(recList).map((missingItem, idx) => (
      <li
        className={cn('reconcilation__missing-list-item', {
          'reconcilation__missing-list-item--attention':
            recList[missingItem] === 'miss_in_bnk2'
        })}
        key={missingItem}
      >
        {recItemKey === 'bank' ? (
          `${missingItem} - ${t(recList[missingItem])}`
        ) : (
          <Link
            className="reconcilation__link"
            to={missingRoutes[recItemKey](missingItem)}
          >
            {`${missingItem} - ${t(recList[missingItem])}`}
          </Link>
        )}
      </li>
    ));
  };

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
              <span className="reconcilation__head-title">Diff amount:</span>
              <span>{state.detail[recItemKey].diffAmount || 0}</span>
            </div>
            <div className="reconcilation__head reconcilation__total-count">
              <span className="reconcilation__head-title">Total Amount:</span>
              <span>{state.detail[recItemKey].totalAmount || 0}</span>
            </div>
          </div>

          <ul className="reconcilation__missing-list">
            {getReconcilationMissingList(
              state.detail[recItemKey].missing,
              recItemKey
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ReconcilationDetail;
