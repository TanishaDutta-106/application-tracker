import { useEffect, useState } from "react";

function App() {
  const [applications, setApplications] = useState([]);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");

  const fetchApplications = () => {
    fetch("http://127.0.0.1:8000/applications")
      .then((response) => response.json())
      .then((data) => {
        setApplications(data.applications);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company: company,
        role: role,
        status: status,
      }),
    }).then(() => {
      setCompany("");
      setRole("");
      setStatus("Applied");
      fetchApplications();
    });
  };

  const updateStatus = (id, newStatus) => {
    fetch(`http://127.0.0.1:8000/applications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    }).then(() => {
      fetchApplications();
    });
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h1>Application Tracker</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <div>
          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>

        <div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button type="submit">Add Application</button>
      </form>

      <ul>
        {applications.map((app) => (
          <li key={app.id} style={{ marginBottom: "0.75rem" }}>
            <strong>{app.company}</strong> — {app.role}

            <select
              value={app.status}
              onChange={(e) => updateStatus(app.id, e.target.value)}
              style={{ marginLeft: "0.5rem" }}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

