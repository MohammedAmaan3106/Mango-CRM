import { useState, useEffect } from "react";
import {
  Users,
  IndianRupee,
  Search,
  Pencil,
  Trash2,
  CreditCard,
  Calendar,
  Phone
} from "lucide-react";
import axios from "axios";

function App() {
  
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("Monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Active");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const totalMembers = members.length;

const activeMembers = members.filter(
  (m) => m.status === "Active"
).length;

const expiredMembers = members.filter(
  (m) => m.status === "Expired"
).length;
const expiringSoon = members.filter((member) => {
  if (!member.end_date) return false;

  const today = new Date();
  const endDate = new Date(member.end_date);

  const diffDays =
    (endDate - today) /
    (1000 * 60 * 60 * 24);

  return diffDays >= 0 && diffDays <= 7;
});
  
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [totalRevenue, setTotalRevenue] = useState(0);

  const SECRET_CODE = "VSQ@2026#ADMIN";

const [accessCode, setAccessCode] = useState("");

const [isUnlocked, setIsUnlocked] =
  useState(false);

const [error, setError] = useState("");

  const loadMembers = async () => {
    const response = await axios.get(
      "http://localhost:5000/members"
    );

    setMembers(response.data);
  };
  const loadRevenue = async () => {
  const response = await axios.get(
    "http://localhost:5000/revenue"
  );

  setTotalRevenue(
    response.data.totalRevenue || 0
  );
};

  useEffect(() => {
  loadMembers();
  loadRevenue();
  loadPayments();
}, []);

const unlockCRM = () => {
  if (accessCode === SECRET_CODE) {
    setIsUnlocked(true);
    setError("");
  } else {
    setError("❌ Invalid Access Code");
  }
};


const loadPayments = async () => {
  const response = await axios.get(
    "http://localhost:5000/payments"
  );

  setPayments(response.data);
};

  const addMember = async () => {
  if (editingId) {
    await axios.put(
      `http://localhost:5000/members/${editingId}`,
      {
        name,
        phone,
        plan,
        start_date: startDate,
        end_date: endDate,
        status,
      }
    );

    setEditingId(null);
  } else {
    await axios.post(
      "http://localhost:5000/members",
      {
        name,
        phone,
        plan,
        start_date: startDate,
        end_date: endDate,
        status,
      }
    );
  }

  setName("");
  setPhone("");
  setPlan("Monthly");
  setStartDate("");
  setEndDate("");
  setStatus("Active");

  loadMembers();
};

  const deleteMember = async (id) => {
    await axios.delete(
      `http://localhost:5000/members/${id}`
    );

    loadMembers();
  };

  const editMember = (member) => {
  setEditingId(member.id);

  setName(member.name);
  setPhone(member.phone);
  setPlan(member.plan);
  setStartDate(member.start_date?.split("T")[0] || "");
  setEndDate(member.end_date?.split("T")[0] || "");
  setStatus(member.status);
};

const addPayment = async (memberId) => {
  await axios.post(
    "http://localhost:5000/payments",
    {
      member_id: memberId,
      amount,
      payment_date: paymentDate,
      payment_method: paymentMethod,
    }
  );

  alert("Payment Added Successfully");

  setAmount("");
  setPaymentDate("");
  setPaymentMethod("Cash");
  loadRevenue();
  loadPayments();
};
if (!isUnlocked) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 p-6">

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">

        <h1 className="text-4xl font-extrabold text-center text-purple-700">
          V-Square Gym CRM
        </h1>

        <p className="text-center text-gray-500 mt-3 mb-6">
          Premium Admin Access
        </p>

        <input
          type="password"
          placeholder="Enter Access Code"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <button
          onClick={unlockCRM}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-xl"
        >
          Unlock CRM
        </button>

      </div>

    </div>
  );
}
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
  <h1 className="text-5xl font-extrabold tracking-wide">
    V-Square Gym CRM
  </h1>

  <p className="mt-2 text-lg text-purple-100">
    Smart Member Management System
  </p>
</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
    <h3>Total Members</h3>
    <p className="text-3xl font-bold">
      {totalMembers}
    </p>
  </div>

  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
    <h3>Active Members</h3>
    <p className="text-3xl font-bold">
      {activeMembers}
    </p>
  </div>

  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
    <h3>Expired Members</h3>
    <p className="text-3xl font-bold">
      {expiredMembers}
    </p>
  </div>
  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
  <h3>Total Revenue</h3>
  <p className="text-3xl font-bold">
    ₹{totalRevenue}
  </p>
</div>
<div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-8 border-yellow-500 rounded-2xl shadow-lg p-6 mb-8">
  <h2 className="text-xl font-bold mb-3">
    ⚠ Expiring Within 7 Days
  </h2>

  {expiringSoon.length === 0 ? (
    <p>No memberships expiring soon.</p>
  ) : (
    expiringSoon.map((member) => (
      <div key={member.id}>
        {member.name} - Expires on{" "}
        {member.end_date?.split("T")[0]}
      </div>
    ))
  )}
</div>


</div>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
  ➕ Add Member
</h2>

        <input
          type="text"
          placeholder="Member Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
          className="w-full rounded-xl border border-gray-300 p-3 mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
        />

        <select
          value={plan}
          onChange={(e) =>
            setPlan(e.target.value)
          }
          className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
        >
          <option>Monthly</option>
          <option>Quarterly</option>
          <option>Half Yearly</option>
          <option>Yearly</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            setStartDate(e.target.value)
          }
          className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) =>
            setEndDate(e.target.value)
          }
          className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
        >
          <option>Active</option>
          <option>Expired</option>
        </select>

        <button
  onClick={addMember}
  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition"
>
  {editingId ? "Update Member" : "Add Member"}
</button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-2xl mb-4">
           Members Directory
        </h2>
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-8">
  <h3 className="text-xl mb-3">
    Record Payment
  </h3>

  <input
    type="number"
    placeholder="Amount"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
  />

  <input
    type="date"
    value={paymentDate}
    onChange={(e) => setPaymentDate(e.target.value)}
    className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
  />

  <select
    value={paymentMethod}
    onChange={(e) =>
      setPaymentMethod(e.target.value)
    }
    className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
  >
    <option>Cash</option>
    <option>UPI</option>
    <option>Card</option>
  </select>

  <p>
    Select a member below and click
    "Pay"
  </p>
</div>

        <input
  type="text"
  placeholder="Search by name or phone......."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="border p-2 w-full mb-4"
/>

        {members
  .filter(
    (member) =>
      member.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      member.phone
        ?.includes(search)
  )
  .map((member) => (
          <div
  key={member.id}
  className="bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 p-5 mb-5 border border-gray-200 hover:shadow-xl transition"
>
            <h3 className="text-2xl font-bold text-gray-800">
  {member.name}
</h3>
            <div className="mt-3 space-y-2 text-gray-600">

  <p>
    <span className="font-semibold text-gray-800">
      Phone
    </span>
    : {member.phone}
  </p>

  <p>
    <span className="font-semibold text-gray-800">
      Plan
    </span>
    : {member.plan}
  </p>

  <p>
    <span className="font-semibold text-gray-800">
      Start
    </span>
    : {member.start_date?.split("T")[0]}
  </p>

  <p>
    <span className="font-semibold text-gray-800">
      End
    </span>
    : {member.end_date?.split("T")[0]}
  </p>

</div>
            <br />
            Status:
<span
  className={`ml-2 px-3 py-1 rounded-full text-sm font-bold ${
    member.status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {member.status}
</span>
            <br />
            <div className="flex flex-wrap gap-3 mt-5">
  <button
    onClick={() => addPayment(member.id)}
    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-xl transition-all duration-300"
  >
     Pay
  </button>

  <button
    onClick={() => editMember(member)}
    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl transition-all duration-300"
  >
     Edit
  </button>

  <button
    onClick={() => deleteMember(member.id)}
    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-xl transition-all duration-300"
  >
     Delete
  </button>
</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
  <h2 className="text-2xl font-bold mb-6">
    💳 Payment History
  </h2>

  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gray-100">
        <th className="text-left p-3">Member ID</th>
        <th className="text-left p-3">Amount</th>
        <th className="text-left p-3">Payment Date</th>
        <th className="text-left p-3">Method</th>
      </tr>
    </thead>

    <tbody>
      {payments.length === 0 ? (
        <tr>
          <td
            colSpan="4"
            className="text-center p-4 text-gray-500"
          >
            No payments found.
          </td>
        </tr>
      ) : (
        payments.map((payment) => (
          <tr
            key={payment.id}
            className="border-b hover:bg-gray-50"
          >
            <td className="p-3">
              {payment.name}
            </td>

            <td className="p-3 font-semibold text-green-600">
              ₹{payment.amount}
            </td>

            <td className="p-3">
              {payment.payment_date?.split("T")[0]}
            </td>

            <td className="p-3">
              {payment.payment_method}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
    </div>
    
  );
}

export default App;