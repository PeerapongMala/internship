import { Template } from "../cover"; 
interface TemplatePickerProps {
  templates: Template[];
  onSelect: (templateId: number) => void;
}

const TemplatePicker: React.FC<TemplatePickerProps> = ({ templates, onSelect }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[109px]">
    {templates.map((template, index) => (
      <div
        key={`${template.id}` + index}
        onClick={() => onSelect(template.id)}
        className="w-full max-w-[232px] mx-auto cursor-pointer rounded-lg p-2 hover:ring-2 hover:ring-[#D9A84E] transition-all"
      >
        <img src={template.image} className="w-full h-full" alt={template.text} />
        <div className="mt-3 text-center font-medium dark:text-white">
          {template.text}
        </div>
      </div>
    ))}
  </div>
);

export default TemplatePicker;
