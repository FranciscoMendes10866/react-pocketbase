import { FC, ForwardRefExoticComponent, RefAttributes } from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";

type RouterLinkProps = ForwardRefExoticComponent<
  LinkProps & RefAttributes<HTMLAnchorElement>
>;

interface Props extends Partial<RouterLinkProps> {
  label: string;
  linkLabel: string;
  to: string;
}

export const Link: FC<Props> = ({ label, linkLabel, ...props }) => {
  return (
    <div className="my-3 mb-1.5 text-sm font-medium text-gray-500 dark:text-gray-300">
      {label}
      <RouterLink
        className="text-blue-700 hover:underline dark:text-blue-500 ml-1"
        {...props}
      >
        {linkLabel}
      </RouterLink>
    </div>
  );
};
