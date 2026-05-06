import IconPen from '@core/design-system/library/component/icon/IconPen';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';

type TableRowActionsProps = {
  recordId: string;
};

const TableRowActions = ({ recordId }: TableRowActionsProps) => (
  <div className="flex space-x-2">
    <button
      onClick={() => console.log(`Editing record ${recordId}`)}
      className="text-black hover:underline"
    >
      <IconPen />
    </button>
    <button
      onClick={() => console.log(`Archiving record ${recordId}`)}
      className="text-black hover:underline"
    >
      <IconArchive />
    </button>
  </div>
);

export default TableRowActions;
