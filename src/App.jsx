import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://fakeapi.in/api/products?page=${pageNum}&limit=${limit}`
      );
      const result = await response.json();
      setData(result.products);
      setFilteredData(result.products);
    };

    fetchData();
  }, [pageNum, limit]);

  useEffect(() => {
    if (debouncedSearch) {
      const result = data.filter((item) =>
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setFilteredData(result);
    } else {
      setFilteredData(data);
    }
  }, [debouncedSearch, data]);

  return (
    <>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div>
        {filteredData.length > 0
          ? filteredData.map((item) => <div key={item.id}>{item.name}</div>)
          : "No results found"}
      </div>

      <button onClick={() => setPageNum((prev) => (prev > 1 ? prev - 1 : 1))}>
        Prev
      </button>

      <button onClick={() => setPageNum((prev) => prev + 1)}>
        Next
      </button>

      <input
        type="number"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value) || 10)}
      />

      <p>Page: {pageNum} | Limit: {limit}</p>
    </>
  );
}

export default App;
