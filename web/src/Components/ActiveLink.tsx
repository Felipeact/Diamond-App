

import { ReactElement, cloneElement } from "react";
import { Link, LinkProps, useLocation } from "react-router-dom";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
}

export function ActiveLink( {children, ...rest }: ActiveLinkProps){
  const { pathname } = useLocation()

  const className = pathname === rest.to
  ? 'px-3 h-12  flex items-center group bg-purple-500 rounded-r-lg text-white-500'
  : 'px-3 h-12  flex items-center group';

  return (
    <Link {...rest}>
      {cloneElement(children, {
        className
      })}
    </Link>
  )
}