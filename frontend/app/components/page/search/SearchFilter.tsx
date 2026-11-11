import { useState, type Dispatch, type SetStateAction } from "react";
import { BsFilterCircle, BsFilterCircleFill } from "react-icons/bs";
import type {
    ISearchFilterCategory,
    SearchChoiceOptions,
    SearchChoiceOptionsKeyType,
} from "../home/SearchBar";

const typeFilterOptions = [
    { label: "전체", value: "", name: "type", defaultChecked: true },
    { label: "개인", value: "user", name: "type" },
    { label: "조직", value: "org", name: "type" },
];

const languageFilterOptions = [
    { label: "전체", value: "", name: "language", defaultChecked: true },
    { label: "C", value: "C", name: "language" },
    { label: "C++", value: "C++", name: "language" },
    { label: "Java", value: "Java", name: "language" },
    { label: "Kotlin", value: "Kotlin", name: "language" },
    { label: "Javascript", value: "Javascript", name: "language" },
    { label: "Typescript", value: "Typescript", name: "language" },
    { label: "C#", value: "C#", name: "language" },
    { label: "Python", value: "Python", name: "language" },
    { label: "Go", value: "Go", name: "language" },
    { label: "PHP", value: "PHP", name: "language" },
    { label: "Ruby", value: "Ruby", name: "language" },
];

const FilterOpenButton = ({
    isFilterOpen,
    setIsFilterOpen,
}: {
    isFilterOpen: boolean;
    setIsFilterOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    return (
        <button
            type="button"
            className="flex gap-2"
            onClick={() => {
                setIsFilterOpen((e) => !e);
            }}>
            검색 필터
            {!isFilterOpen ? (
                <BsFilterCircle
                    size={24}
                    aria-label="필터링 ui"
                />
            ) : (
                <BsFilterCircleFill
                    size={24}
                    aria-label="필터링 on UI"
                />
            )}
        </button>
    );
};

const FilterOptionRadio = ({
    label,
    value,
    name,
    onClick,
    defaultChecked,
}: {
    label: string;
    value: string;
    name: string;
    onClick?: () => void;
    defaultChecked?: boolean;
}) => {
    return (
        <label className="border-primary group has-checked:bg-primary rounded-full border px-4 py-1 has-checked:text-white">
            {label}
            <input
                type="radio"
                name={name}
                value={value}
                onClick={onClick}
                defaultChecked={defaultChecked}
            />
        </label>
    );
};

export default function SearchFilter({
    choice,
    category,
    choiceHandler,
}: {
    choice: SearchChoiceOptions;
    category: ISearchFilterCategory;
    choiceHandler: (key: SearchChoiceOptionsKeyType, value: string) => void;
}) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="relative w-full self-center">
            <div className="mb-1 flex items-center gap-2">
                <FilterOpenButton
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                />
                <ul className="flex gap-1">
                    {choice.type && (
                        <li className="flex items-center rounded-full border px-2">
                            {"type:" + choice.type}
                        </li>
                    )}
                    {choice.language && (
                        <li className="flex items-center rounded-full border px-2">
                            {"language:" + choice.language}
                        </li>
                    )}
                    {choice.location && (
                        <li className="flex items-center rounded-full border px-2">
                            {"location:" + choice.location}
                        </li>
                    )}
                </ul>
            </div>
            <div
                className={
                    isFilterOpen
                        ? `bg-panel/30 absolute z-1 flex w-full flex-col gap-3 rounded-lg px-3 py-4 backdrop-blur-sm`
                        : `hidden`
                }>
                <fieldset
                    className="flex gap-4 **:appearance-none"
                    onClick={(e) => {
                        if (e.target instanceof HTMLInputElement) {
                            choiceHandler("type", e.target.value);
                        }
                    }}>
                    <legend className="mb-2 font-semibold">타입</legend>

                    {typeFilterOptions.map((option) => (
                        <FilterOptionRadio
                            key={`${option.name}-${option.value}`}
                            {...option}
                        />
                    ))}
                </fieldset>

                <fieldset
                    className="flex flex-wrap gap-4 **:appearance-none"
                    onClick={(e) => {
                        if (e.target instanceof HTMLInputElement) {
                            choiceHandler("language", e.target.value);
                        }
                    }}>
                    <legend className="mb-2 font-semibold"> 언어 </legend>

                    {languageFilterOptions.map((option) => (
                        <FilterOptionRadio
                            key={`${option.name}-${option.value}`}
                            {...option}
                        />
                    ))}
                    <label className="flex items-center gap-2">
                        <p>직접 입력</p>
                        <input
                            name="language"
                            className="outline-primary mr-2 rounded-full px-4 py-1 outline-1 focus:outline-2"
                            placeholder="language"
                            onChange={(e) => {
                                choiceHandler("language", e.target.value);
                            }}
                        />
                    </label>
                </fieldset>

                {category.value === "users" && (
                    <div className="flex flex-col">
                        <label
                            className="mb-2 font-semibold"
                            htmlFor="combobox-languages">
                            지역
                        </label>
                        <input
                            placeholder="지역을 입력하세요"
                            id="location"
                            name="location"
                            className="outline-primary h-8 w-sm rounded-lg px-2 py-1 outline-1 focus:outline-2"
                            onChange={(e) => {
                                choiceHandler("location", e.target.value);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
