import React, { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Dispatch } from 'redux';

import { Checkbox } from '../../components';
import { EmptyProducts } from './components';
import { selectActive, selectPromo, toggleActive, togglePromo } from '../../state';
import { User } from '../../models';

const Dashboard = ({ user }: { user: User | null }) => {
  /* if (!user) {
    return <Navigate to="/login" replace />;
  } */

  const active = useSelector(selectActive);
  const promo = useSelector(selectPromo);

  const dispatch: Dispatch = useDispatch();

  return (
    <div className="container-fluid d-flex flex-column">
      <div className="row">
        <div className="col-md-5 col-sm-6 col-12 p-0">
          <input placeholder="Search" type="search" />
        </div>

        <div className="col-md-3 col-sm-4 col-6 dashboard__menu-checkboxes">
          <Checkbox
            change={() => dispatch(toggleActive())}
            checked={active}
            label="Active"
            name="active"
          />

          <Checkbox
            change={() => dispatch(togglePromo())}
            checked={promo}
            label="Promo"
            name="promo"
          />
        </div>

        <div className="col-md-offset-2 col-md-2 col-sm-offset-1 col-sm-1 col-6"></div>
      </div>

      <div className="align-items-center d-flex flex-grow-1 justify-content-center row">
        <EmptyProducts />
      </div>
    </div>
  );
};

export default Dashboard;
