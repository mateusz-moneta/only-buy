import React, { useState } from 'react';

import './Avatar.scss';

export const Avatar = ({ logout, src }: { logout: () => void; src: string }) => {
  const [isOpenMenu, setOpenMenu] = useState(false);

  const closeMenu = () => setOpenMenu(false);
  const openMenu = () => setOpenMenu(true);

  return (
    <div onClick={() => openMenu()} className="avatar">
      {src && <img src={src} alt="Avatar of user" />}

      {isOpenMenu && (
        <div onMouseLeave={() => closeMenu()} className="avatar__menu">
          <ul>
            <li>
              <a href="/products-creator">Creator of product</a>
            </li>

            <li onClick={logout}>Log out</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Avatar;
