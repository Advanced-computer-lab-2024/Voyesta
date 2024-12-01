import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/PromoCodeView.css"; // Import custom CSS for styling
const baseUrl = "http://localhost:3000/api/admin";

function PromoCodeView({ baseUrl, title }) {
    const [promoCodes, setPromoCodes] = useState([]);
    const [newPromoCode, setNewPromoCode] = useState({
        code: "",
        discount: 0,
        validFrom: "",
        validUntil: "",
    });
    const [isEditing, setIsEditing] = useState(null);

    // Fetch promo codes
    useEffect(() => {
        axios
            .get("http://localhost:3000/api/admin/getGlobalPromoCodes")
            .then((response) => {
                console.log("Fetched promo codes:", response.data);
                setPromoCodes(response.data);
            })
            .catch((error) => console.error("Error fetching promo codes:", error));
    }, [baseUrl]);

    // Add new promo code
    const handleAddPromoCode = () => {
        console.log("Adding promo code:", newPromoCode); // Debug log
    
        // Format the dates to "YYYY-MM-DD" before sending to the backend
        const formattedPromoCode = {
            ...newPromoCode,
            validFrom: formatDate(newPromoCode.validFrom),
            validUntil: formatDate(newPromoCode.validUntil),
        };
    
        axios
            .post("http://localhost:3000/api/admin/createGlobalPromoCode", formattedPromoCode)
            .then((response) => {
                console.log("Promo code added:", response.data); 
                setPromoCodes((prevPromoCodes) => [...prevPromoCodes, response.data]); // Correctly append
                setNewPromoCode({ code: "", discount: 0, validFrom: "", validUntil: "" });
            })
            .catch((error) => console.error("Error adding promo code:", error));
    };
    
    // Helper function to format date to YYYY-MM-DD
    const formatDate = (date) => {
        if (!date) return ''; // If no date, return an empty string
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // Format date to "YYYY-MM-DD"
    };
    

    // Edit promo code
    /*
    const handleEditPromoCode = () => {
        if (!newPromoCode.code) {
            console.error("Promo code code is required for editing.");
            return;
        }

        console.log("Editing promo code:", newPromoCode.code, newPromoCode); // Debug log
        axios
            .put(`http://localhost:3000/api/admin/updateGlobalPromoCode/${newPromoCode.code}`, newPromoCode)
            .then(() => {
                console.log("Promo code edited successfully");
                setPromoCodes((prevPromoCodes) =>
                    prevPromoCodes.map((promo) =>
                        promo.code === newPromoCode.code ? { ...promo, ...newPromoCode } : promo
                    )
                );
                setNewPromoCode({ code: "", discount: 0, validFrom: "", validUntil: "" });
                setIsEditing(null);
            })
            .catch((error) => console.error("Error editing promo code:", error));
    };
     */


    // Delete promo code
    const handleDeletePromoCode = (code) => {
        console.log("Deleting promo code:", code); // Debug log
        axios
            .delete(`http://localhost:3000/api/admin/deleteGlobalPromoCode/${code}`)
            .then(() => {
                console.log("Promo code deleted successfully"); // Debug log
                setPromoCodes((prevPromoCodes) => prevPromoCodes.filter((promo) => promo.code !== code));
            })
            .catch((error) => {
                console.error("Error deleting promo code:", error); // Debug log
            });
    };

    // Handle Edit click
    const handleEditClick = (promo) => {
        setIsEditing(promo.code); // Set the promo code to be edited
        setNewPromoCode({ ...promo }); // Pre-fill the form with the promo's current values
    };

    return (
        <div className="promo-code-container">
            <h1 className="promo-code-title">{title}</h1>
            <div className="form-container">
                <h2>{isEditing ? "Edit Promo Code" : "Add Promo Code"}</h2>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Promo Code"
                        value={newPromoCode.code}
                        onChange={(e) =>
                            setNewPromoCode({ ...newPromoCode, code: e.target.value })
                        }
                        className="form-input"
                    />
                    <input
                        type="number"
                        placeholder="Discount (%)"
                        value={newPromoCode.discount}
                        onChange={(e) =>
                            setNewPromoCode({ ...newPromoCode, discount: e.target.value })
                        }
                        className="form-input"
                    />
                    <input
                        type="date"
                        placeholder="Valid From"
                        value={newPromoCode.validFrom || ""} // Ensure a valid empty string for date
                        onChange={(e) =>
                            setNewPromoCode({ ...newPromoCode, validFrom: e.target.value })
                        }
                        className="form-input"
                    />
                    <input
                        type="date"
                        placeholder="Valid Until"
                        value={newPromoCode.validUntil || ""} // Ensure a valid empty string for date
                        onChange={(e) =>
                            setNewPromoCode({ ...newPromoCode, validUntil: e.target.value })
                        }
                        className="form-input"
                    />
                </div>
                <button
                    className="btn add-btn"
                    onClick={isEditing ? handleEditPromoCode : handleAddPromoCode}
                >
                    {isEditing ? "Update" : "Add"}
                </button>
                {isEditing && (
                    <button className="btn cancel-btn" onClick={() => setIsEditing(null)}>
                        Cancel
                    </button>
                )}
            </div>
            <table className="promo-code-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Discount (%)</th>
                        <th>Valid From</th>
                        <th>Valid Until</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {promoCodes.length > 0 ? (
                        promoCodes.map((promo) => (
                            <tr key={promo.code}>
                                <td>{promo.code}</td>
                                <td>{promo.discount}</td>
                                <td>{new Date(promo.validFrom).toLocaleDateString()}</td>
                                <td>{new Date(promo.validUntil).toLocaleDateString()}</td>
                                <td>{promo.status}</td>
                                <td>
                                    
                                    <button
                                        className="btn delete-btn"
                                        onClick={() => handleDeletePromoCode(promo.code)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No promo codes found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}


export default PromoCodeView;
