//SharedFile will contain roomID, originalFileName, uploadedAt, StoredFileName(in case duplicate file names)
public class SharedFile{
    public string roomId  {get; set;}  // Unique file identifier
    public string originalFileName {get; set;}  // User's original filename
    public DateTime uploadedAt {get; set;}
    public string storedFileName {get; set;} // Filename used on the server (unique)

    public SharedFile(){
        uploadedAt = DateTime.UtcNow;
    }
}