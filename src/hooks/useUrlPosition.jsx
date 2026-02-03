import { useSearchParams } from "react-router-dom";

function useUrlPosition() {
  const [searchParams] = useSearchParams();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) return [null, null];

  return [Number(lat), Number(lng)];
}

export default useUrlPosition;
