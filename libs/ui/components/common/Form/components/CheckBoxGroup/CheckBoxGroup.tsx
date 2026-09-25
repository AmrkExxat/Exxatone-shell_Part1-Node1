import type CheckBoxGroupProps from './CheckBoxGroup.types';

export default function CheckBoxGroup({
  title,
  children,
  ...props
}: CheckBoxGroupProps): JSX.Element {
  return (
    <>
      <div className="text-default block text-sm leading-6 font-bold">
        {title + ' '}
        {props.required === true && <span className="text-sm leading-6 text-red-600">*</span>}
      </div>
      <div aria-label={title} role="group">
        {children}
      </div>
    </>
  );
}
