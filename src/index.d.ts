import { terranext } from "./declarations";

declare function terranext<G, L>(configuration: terranext.Configuration, write: boolean): Promise<void>;
declare function terranext<G, L>(configuration: terranext.Configuration): Promise<terranext.Result<G, L>>;
declare function terranext<G, L>(): Promise<terranext.Result<G, L>>;

export = terranext;
