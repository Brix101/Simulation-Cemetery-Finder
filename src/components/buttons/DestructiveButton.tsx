import React, { FC } from "react";

export interface ButtonProps
  extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    React.AriaAttributes {}

type Props = ButtonProps & {
  isSmall?: boolean;
  isLoading?: boolean;
};
const DistructiveButton: FC<Props> = (props) => {
  const { isSmall, isLoading, ...rest } = props;
  return (
    <button
      className={`flex h-12 w-full items-center justify-center rounded-lg border-2  border-transparent bg-ruby-red px-2 hover:bg-ruby-red-2 active:border-red-400 disabled:cursor-default disabled:bg-gray-600
      ${isSmall ? "h-10" : "h-12"}`}
      {...rest}
    >
      {isLoading ? (
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-b-4 border-white/[.50] border-b-white" />
      ) : (
        <span
          className={`font-sans  font-bold capitalize text-white
        ${isSmall ? "text-sm" : "text-base"}`}
        >
          {rest.children ?? "Destructive Button"}
        </span>
      )}
    </button>
  );
};

export default DistructiveButton;
