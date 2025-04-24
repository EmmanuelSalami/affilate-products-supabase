{ pkgs }:
{
  channel = "stable-24.05";
  packages = [ pkgs.nodejs_20 ];

  idx.previews.previews.web = {
    command = [
      "npx" "next" "dev"
      "-H" "0.0.0.0"
      "-p" "$PORT"
    ];
    manager = "web";
  };
}
