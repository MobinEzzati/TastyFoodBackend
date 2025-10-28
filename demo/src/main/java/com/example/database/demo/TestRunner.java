package com.example.database.demo;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class TestRunner {

    private static final String BASE_URL = "http://localhost:8080";

    private static void post(String label, String url) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .build();
            HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
            System.out.println("\n🧪 " + label);
            System.out.println("" + url);
            System.out.println("HTTP " + res.statusCode());
            System.out.println("" + res.body());
        } catch (Exception e) {
            System.err.println("" + label + " failed: " + e.getMessage());
        }
    }

    private static void delete(String label, String url) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .DELETE()
                    .build();
            HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
            System.out.println("\n🧪 " + label);
            System.out.println("➡️ " + url);
            System.out.println("⬅️ HTTP " + res.statusCode());
            System.out.println("📦 " + res.body());
        } catch (Exception e) {
            System.err.println("❌ " + label + " failed: " + e.getMessage());
        }
    }


    private static void get(String label, String url) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();
            HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
            System.out.println("\n🧪 " + label);
            System.out.println("➡️ " + url);
            System.out.println("⬅️ HTTP " + res.statusCode());
            System.out.println("📦 " + res.body());
        } catch (Exception e) {
            System.err.println("" + label + " failed: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        System.out.println("🚀 Running TastyFood Integration Tests...");

        // =============================
        //  LOGIN TESTS
        // =============================
        post("✅ Successful login by staff",
                BASE_URL + "/api/auth/login?username=john01&password=Password1");

        post("❌ Invalid login by staff",
                BASE_URL + "/api/auth/login?username=john01&password=Wrong123");

        // =============================
        //  STAFF TESTS
        // =============================
        post("✅ Create new staff account",
                BASE_URL + "/api/auth/register?username=mary01&password=Password1&isAdmin=false");

        delete("🗑️ Delete staff account",
                BASE_URL + "/api/staff/delete/1");


        // =============================
        //  DRIVER TESTS
        // =============================
        post("✅ Add new driver record",
                BASE_URL + "/api/drivers/add?driverName=Tom%20Driver");

        delete("🗑️ Delete driver record",
                BASE_URL + "/api/drivers/delete/1");


        // =============================
        //  ORDER TESTS
        // =============================

        // ✅ Create a new order first
        post("🧾 Create new order",
                BASE_URL + "/api/orders/create?customerName=Mobin&deliveryAddressId=1&driverId=1&staffId=1&tipAmount=5.0");

        // ✅ Assign driver to existing order
        post("🚗 Assign driver to order",
                BASE_URL + "/api/orders/assign?orderId=3&driverId=5&staffId=2");

       // ✅ Mark order as delivered
        post("📦 Mark order delivered",
                BASE_URL + "/api/orders/1/deliver");

       // ✅ Retrieve all orders for verification
        get("📋 Retrieve all orders",
                BASE_URL + "/api/orders/all");


        System.out.println("\n✅ All integration tests completed successfully!");
    }
}

