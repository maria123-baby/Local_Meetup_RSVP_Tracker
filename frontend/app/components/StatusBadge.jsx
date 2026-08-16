export default function StatusBadge({ status }) {
    let className = "status-badge";

    if (status === "going") {
        className += " status-going";
    } 
    else if (status === "maybe") {
        className += " status-maybe";
    } 
    else if (status === "declined") {
        className += " status-declined";
    }

    return (
        <span className={className}>
            {status}
        </span>
    );
}