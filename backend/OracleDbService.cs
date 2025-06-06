using System;
using System.Collections.Generic;
using Oracle.ManagedDataAccess.Client;  // Oracle DB driver
using LiveShareHubAPI.Models;           // For Room and SharedFile models
using Microsoft.Extensions.Configuration;

public class OracleDbService
{
    private readonly string connectionString;

    // Constructor sets connection string to your Oracle XE instance
    public OracleDbService(IConfiguration configuration)
    {
        connectionString = configuration.GetConnectionString("OracleDb");
    }

    // Get all files associated with a given room ID from DB
    public List<SharedFile> GetFilesByRoomId(string roomId)
    {
        var files = new List<SharedFile>();

        using var conn = new OracleConnection(connectionString);
        conn.Open();

        using var cmd = new OracleCommand(
            "SELECT room_id, original_file_name, uploaded_at, stored_file_name FROM shared_files WHERE room_id = :roomId", conn);
        cmd.Parameters.Add(new OracleParameter("roomId", roomId));

        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            files.Add(new SharedFile
            {
                roomId = reader.GetString(0),
                originalFileName = reader.GetString(1),
                uploadedAt = reader.GetDateTime(2),
                storedFileName = reader.GetString(3)
            });
        }

        return files;
    }

    // Get all Rooms
    public List<Room> getAllRooms()
    {
        var rooms = new List<Room>();

        using var conn = new OracleConnection(connectionString);
        conn.Open();

        using var cmd = new OracleCommand("SELECT room_id, created_at FROM rooms", conn);
        using var reader = cmd.ExecuteReader();

        while (reader.Read())
        {
            rooms.Add(new Room(reader.GetString(0))  // room_id
            {
                createdAt = reader.GetDateTime(1)
            });
        }

        return rooms;
    }

    // Delete Room by ID
    public void DeleteRoomByID(string roomId){
        using var conn = new OracleConnection(connectionString);
        conn.Open();

        // First delete files associated with the room (foreign key constraint)
        using var cmd = new OracleCommand("DELETE FROM shared_files WHERE room_id = :roomId", conn);
        cmd.Parameters.Add(new OracleParameter("roomId", roomId));
        cmd.ExecuteNonQuery();

        // Delete the room itself
        using var deleteCmd = new OracleCommand("DELETE FROM rooms WHERE room_id = :roomId", conn);
        deleteCmd.Parameters.Add(new OracleParameter("roomId", roomId));
        deleteCmd.ExecuteNonQuery();
    }

    // Get a Room object by its ID (with files loaded)
    // Returns null if room doesn't exist
public Room? GetRoomById(string roomId)
{
    using var conn = new OracleConnection(connectionString);
    conn.Open();

    using var cmd = new OracleCommand("SELECT room_id, created_at FROM rooms WHERE room_id = :roomId", conn);
    cmd.Parameters.Add(new OracleParameter("roomId", roomId));

    using var reader = cmd.ExecuteReader();
    if (reader.Read())
    {
        return new Room(reader.GetString(0)) {
            createdAt = reader.GetDateTime(1),
            Files = GetFilesByRoomId(roomId)
        };
    }

    return null;
}


    // Insert a new Room into the database
    public void CreateRoom(Room room)
    {
        using var conn = new OracleConnection(connectionString);
        conn.Open();

        using var cmd = new OracleCommand("INSERT INTO rooms (room_id, created_at) VALUES (:roomId, :createdAt)", conn);
        cmd.Parameters.Add(new OracleParameter("roomId", room.roomID));
        cmd.Parameters.Add(new OracleParameter("createdAt", room.createdAt));

        cmd.ExecuteNonQuery();
    }

    // Add a SharedFile to the shared_files table for a specific room
    public void AddFileToRoom(string roomId, SharedFile file)
{
    try
    {
        using var conn = new OracleConnection(connectionString);
        conn.Open();

        using var cmd = new OracleCommand(@"
            INSERT INTO shared_files (room_id, original_file_name, uploaded_at, stored_file_name) 
            VALUES (:roomId, :originalFileName, :uploadedAt, :storedFileName)", conn);

        cmd.Parameters.Add(new OracleParameter("roomId", roomId));
        cmd.Parameters.Add(new OracleParameter("originalFileName", file.originalFileName));
        cmd.Parameters.Add(new OracleParameter("uploadedAt", file.uploadedAt));
        cmd.Parameters.Add(new OracleParameter("storedFileName", file.storedFileName));

        cmd.ExecuteNonQuery();
    }
    catch(Exception ex)
    {
        // Log error somewhere - for now just rethrow or write to console
        Console.WriteLine($"Error inserting file: {ex.Message}");
        throw;
    }
}


    // Check if a file with given storedFileName exists in the specified room
    public bool FileExistsInRoom(string roomId, string storedFileName)
    {
        using var conn = new OracleConnection(connectionString);
        conn.Open();

        using var cmd = new OracleCommand(
            "SELECT COUNT(*) FROM shared_files WHERE room_id = :roomId AND stored_file_name = :storedFileName", conn);
        cmd.Parameters.Add(new OracleParameter("roomId", roomId));
        cmd.Parameters.Add(new OracleParameter("storedFileName", storedFileName));

        var count = Convert.ToInt32(cmd.ExecuteScalar());
        return count > 0;
    }
}
