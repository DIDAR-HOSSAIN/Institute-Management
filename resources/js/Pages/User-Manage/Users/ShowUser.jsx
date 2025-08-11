import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { Head } from "@inertiajs/react";

const ShowUser = ({ auth }) => {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`/api/users/${id}`);
            setUser(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Show User
                </h1>
            }
        >
            <Head title="Show User" />
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 margin-tb">
                        <div className="pull-left">
                            <h2>Show User</h2>
                        </div>
                        <div className="pull-right">
                            <Link className="btn btn-primary" to="/users">
                                Back
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12">
                        <div className="form-group">
                            <strong>Name:</strong>
                            <p>{user.name}</p>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12">
                        <div className="form-group">
                            <strong>Email:</strong>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12">
                        <div className="form-group">
                            <strong>Roles:</strong>
                            {user.roles &&
                                user.roles.map((role, index) => (
                                    <span
                                        key={index}
                                        className="badge badge-success"
                                    >
                                        {role}
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default ShowUser;
