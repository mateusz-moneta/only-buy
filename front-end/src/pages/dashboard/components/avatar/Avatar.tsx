import React, { useState } from 'react';

import { RoleName } from '../../../../models';

import './Avatar.scss';

export const Avatar = ({
  logout,
  roleName,
  src
}: {
  logout: () => void;
  roleName: RoleName;
  src: string;
}) => {
  const [isOpenMenu, setOpenMenu] = useState(false);

  const closeMenu = () => setOpenMenu(false);
  const openMenu = () => setOpenMenu(true);

  return (
    <div onClick={() => openMenu()} className="avatar">
      {src && <img src={src} alt="Avatar of user" />}

      {isOpenMenu && (
        <div onMouseLeave={() => closeMenu()} className="avatar__menu">
          <ul>
            {roleName === RoleName.ADMIN && (
              <li>
                <a href="/products-creator">Creator of product</a>
              </li>
            )}

            <li onClick={logout}>Log out</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Avatar;
