export default function StatusBadge({ status }) {
  const classMap = {
    RECEIVED:   'badge badge-received',
    PROCESSING: 'badge badge-processing',
    READY:      'badge badge-ready',
    DELIVERED:  'badge badge-delivered',
  };
  return <span className={classMap[status] || 'badge badge-received'}>{status}</span>;
}
