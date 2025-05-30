// In LiveShareHubAPI/Models/SharedFile.cs
using System;

namespace LiveShareHubAPI.Models 
{
    // SharedFile will contain roomID, originalFileName, uploadedAt, StoredFileName(in case duplicate file names)
    public class SharedFile
    {
        public string roomId { get; set; } = string.Empty; 
        public string originalFileName { get; set; } = string.Empty;
        public DateTime uploadedAt { get; set; }
        public string storedFileName { get; set; } = string.Empty; // Filename used on the server (unique)
        // public long SizeBytes { get; set; } // for sizeOfBits
        // public string ContentType { get; set; } //  for downloads

        public SharedFile()
        {
            uploadedAt = DateTime.UtcNow;

        }
    }
}