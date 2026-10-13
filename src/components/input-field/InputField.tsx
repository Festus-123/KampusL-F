import { Text, TextInput, View, type TextInputProps } from "react-native";

type InputFieldProps = TextInputProps & {
  label: string;
  className?: string;
  placeholderTextColor?: string;
};

const InputField = ({
  label,
  className = "",
  placeholderTextColor = "#64748b",
  ...props
}: InputFieldProps) => {
  return (
    <View className="w-full gap-2">
      <Text className="text-sm font-semibold text-slate-700">{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={placeholderTextColor}
        className={`min-h-12 rounded-xl border border-brand bg-secondary px-3.5 text-base text-slate-900 ${className}`}
      />
    </View>
  );
};

export default InputField;
