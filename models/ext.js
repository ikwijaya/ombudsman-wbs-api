const supportFile = () => {
  return [
    { type: "document", lists: ["pdf", "doc", "ppt", "xls", "docx", "pptx", "xlsx"] },
    { type: "image", lists: ["jpg", "jpeg", "png"] },
    { type: "audio", lists: ["aac", "amr", "mp3", "ogg", "opus"] }
  ];
}


module.exports = {
  supportFile
}