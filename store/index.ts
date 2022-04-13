// zustand store
import create, { SetState } from "zustand";
import { PlaylistItem, PlayListData } from "../components/PlayList";
import { get } from "../libs/fetcher";

type MusicStore = {
  playList: PlayListData | null;
  setPlayList: (data: PlayListData) => void;
  liveItemId: string | null;
  livingAudioUrl: string | null;
  loadThenPlay: (itemId: string) => void;
  pause: () => void;
  play: () => void;
  load: (itemId: string) => Promise<void>;

  playerState: "load" | "play" | "pause" | "stop";
};

const useMusicStore = create<MusicStore>((set, getter) => ({
  liveItemId: null,
  playerState: "stop",
  playList: null,
  livingAudioUrl: null,
  setPlayList: (playList: PlayListData) => {
    set({
      playList,
    });
  },

  play: () => {
    set({
      playerState: "play",
    });
  },

  load: async (itemId: any) => {
    let playList = getter().playList;
    let playingItem =
      playList?.find((item) => {
        return item.id === itemId;
      }) ?? null;
    if (!playingItem) {
      return;
    }
    set({
      playerState: "load",
    });
    let blob = await get(playingItem.src, {
      responseType: "arraybuffer",
      onDownloadProgress: (progressEvent) => {},
    }).then((res: any) => {
      return new Blob([res.data], { type: "audio/mpeg" });
    });

    set({
      livingAudioUrl: URL.createObjectURL(blob),
      liveItemId: itemId,
    });
  },

  loadThenPlay: async (itemId) => {
    await getter().load(itemId);
    getter().play();
    // itemId = 'shit'
    // set({bears: 0})
    // set(i)
  },
  pause: () => {
    set({
      playerState: "pause",
    });
    // set({ bears: 0 })
  },
}));

export default useMusicStore;
