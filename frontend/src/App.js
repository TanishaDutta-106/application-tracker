import { useEffect, useState } from "react";

const headerStyle = {
  borderBottom: "2px solid #ddd",
  padding: "8px",
  textAlign: "left",
};

const cellStyle = {
  borderBottom: "1px solid #eee",
  padding: "8px",
};

function App() {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [deletingId, setDeletingId] = useState(null);

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

  const deleteApplication = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    fetch(`http://127.0.0.1:8000/applications/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        fetchApplications();
      })
      .finally(() => {
        setDeletingId(null);
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

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1rem",
        }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>Company</th>
            <th style={headerStyle}>Role</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td style={cellStyle}>{app.company}</td>
              <td style={cellStyle}>{app.role}</td>
              <td style={cellStyle}>
                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app.id, e.target.value)}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td style={cellStyle}>
                <button
                  onClick={() => deleteApplication(app.id)}
                  disabled={deletingId === app.id}
                  style={{
                    backgroundColor: deletingId === app.id ? "#aaa" : "#e74c3c",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    cursor: deletingId === app.id ? "not-allowed" : "pointer",
                  }}
                >
                  {deletingId === app.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

