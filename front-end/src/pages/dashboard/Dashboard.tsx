import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <>
      <div className="row dashboard__menu">
        <div className="col-md-5 col-sm-6 col-12 p-0">
          <input placeholder="Search" type="search" />
        </div>

        <div className="col-md-3 col-sm-4 col-6 dashboard__menu-checkboxes">
          <div>
            <input id="active" name="active" type="checkbox" checked />
            <label htmlFor="active">Active</label>
          </div>

          <div>
            <input id="promo" name="promo" type="checkbox" />
            <label htmlFor="promo">Promo</label>
          </div>
        </div>

        <div
          className="col-md-offset-2 col-md-2 col-sm-offset-1 col-sm-1 col-6"
          id="dashboard__dropdown"
        ></div>
      </div>

      <div className="row dashboard__content">
        <div className="dashboard__content-empty">
          <img src="public/icons/task-list.svg" alt="List of tasks" />

          <p>Ooops… It’s empty here</p>
          <p>There are no products on the list</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
