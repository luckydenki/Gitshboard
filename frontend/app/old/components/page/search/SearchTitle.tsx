interface SearchHeaderProps {
    name: string;
}

export default function SearchTitle({ name }: SearchHeaderProps) {
    return (
        <header>
            <h2 className="not-md font-semibold text-gray-900">
                Search Results for
                <span className="text-github-light"> "{name}"</span>
            </h2>
        </header>
    );
}
