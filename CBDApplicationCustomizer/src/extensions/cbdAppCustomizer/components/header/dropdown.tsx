import * as React from "react";
import MenuItems from "./menuitems";

const Dropdown = ({ menus, submenus, dropdown, depthLevel }: any) => {
  depthLevel = depthLevel + 1;
  const dropdownClass = depthLevel > 1 ? "left-auto -top-2 right-full" : "left-auto";

  return (
    <ul className={`absolute p-2 w-full min-w-80 z-50 bg-white  rounded-sm shadow-lg text-sm ${dropdownClass} ${dropdown ? "block" : 'hidden'}`}>
      {submenus.map((submenu: any, index: number) => (
        <MenuItems currentMenu={submenu} key={index} depthLevel={depthLevel} menus={menus} />
      ))}
    </ul>
  );
};

export default Dropdown;