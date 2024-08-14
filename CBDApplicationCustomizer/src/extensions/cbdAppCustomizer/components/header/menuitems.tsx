import * as React from "react";
import Dropdown from "./dropdown";
import { Icon } from "@fluentui/react";


const MenuItems = ({ menus, depthLevel, currentMenu }: { menus: any, depthLevel: number, currentMenu: any }) => {
    const submenus = menus.filter((submenu: any) => submenu.HeaderNavParentIdId === currentMenu.ID);
    const [dropdown, setDropdown] = React.useState(false);
    let ref = React.useRef<any>();

    React.useEffect(() => {
        const handler = (event: any) => {
            if (dropdown && ref.current && !ref.current.contains(event.target)) {
                setDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, [dropdown]);

    const onMouseEnter = () => {
        setDropdown(true);
    };

    const onMouseLeave = () => {
        setDropdown(false);
    };

    const toggleDropdown = () => {
        setDropdown((prev) => !prev);
    };

    const closeDropdown = () => {
        dropdown && setDropdown(false);
    };

    return (
        <li
            className="relative text-base text-gray1 font-bold"
            ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={closeDropdown}>
            {submenus && submenus.length > 0 ? (
                <>
                    <button
                        className="flex items-center bg-transparent cursor-pointer w-full gap-2 outline-none focus:outline-none"
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={dropdown ? "true" : "false"}
                        onClick={() => toggleDropdown()}>
                        <a className="grow text-left hover:text-primary flex w-full hover:bg-search hover:rounded-lg p-2 gap-2" data-interception="off" rel="noopener noreferrer" target={currentMenu.IsNew ? "_blank" : "_self"} href={currentMenu.HeaderNavUrl}><span className="grow">{currentMenu.Title}</span><Icon className="flex-none hover:text-primary" iconName={depthLevel > 0 ? 'ChevronRight' : 'ChevronDown'} /></a>

                    </button>
                    <Dropdown
                        menus={menus}
                        depthLevel={depthLevel}
                        submenus={submenus}
                        dropdown={dropdown}
                    />
                </>
            ) : (
                <a className="grow text-left hover:text-primary block hover:bg-search hover:rounded-lg p-2" data-interception="off" rel="noopener noreferrer" target={currentMenu.IsNew ? "_blank" : "_self"} href={currentMenu.HeaderNavUrl}>{currentMenu.Title}</a>
            )}
        </li>
    );
};

export default MenuItems;