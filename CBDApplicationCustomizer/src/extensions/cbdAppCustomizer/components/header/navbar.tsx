import * as React from "react";
import MenuItems from "./menuitems";

const Navbar = ({menus}:{menus:any[]}) => {
    const depthLevel = 0;
  
    return (
      <nav className="desktop-nav">
        <ul className="flex items-center flex-wrap w-fit gap-4">
          {menus && menus.filter((m: any) => m.HeaderNavParentIdId === null).map((menu:any, index:number) => {
            return <MenuItems menus={menus} key={index} depthLevel={depthLevel} currentMenu={menu} />;
          })}
        </ul>
      </nav>
    );
  };
  
  export default Navbar;