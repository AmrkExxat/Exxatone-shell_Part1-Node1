export const ThemeDecorator = (Story: any, context: any) => {
  return (
    <div className="flex h-full w-full flex-col p-4">
      <Story {...context} />
    </div>
  );
};
