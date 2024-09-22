/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { showToast, Toasts, Tooltip } from "@webpack/common";


export default definePlugin({
    name: "StreamPIP",
    authors: [Devs.Joona],
    description: "Stream in picture-in-picture mode",
    patches: [
        {
            find: 'renderBottomRight",',
            replacement: {
                match: /(null!=.{1,70}ACTIVITY).+?(\i\.rightTrayIcon)}\):null,/,
                replace: "$&$self.renderPiPButton({className: $2, shouldShow: $1}),",
            }
        }
    ],
    flux: {
        STREAM_STOP: () => {
            document?.exitPictureInPicture();
        }
    },
    // copy from PictureInPicture plugin
    renderPiPButton: ErrorBoundary.wrap(({ className, shouldShow }: { className: string, shouldShow: boolean; }) => {
        if (!shouldShow) return null;
        return (
            <Tooltip text="Toggle Picture in Picture" >
                {tooltipProps => (
                    <div
                        {...tooltipProps}
                        className={className}
                        role="button"
                        aria-label="Toggle Picture in Picture"
                        style={{ color: "var(--interactive-normal)" }}
                        onClick={e => {
                            const video = e.currentTarget.parentNode!.parentNode!.parentNode!.parentNode!.querySelector("video")!;
                            video.requestPictureInPicture()
                                .then(pipWindow => {
                                    showToast("Entered Picture-in-Picture mode", Toasts.Type.SUCCESS);
                                })
                                .catch(error => {
                                    showToast("Failed to enter Picture-in-Picture mode :(", Toasts.Type.FAILURE);
                                    console.error(error);
                                });
                        }}
                    >
                        <svg width="24px" height="24px" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zm-1 2h-6v4h6v-4z"
                            />
                        </svg>
                    </div>
                )}
            </Tooltip >
        );
    }, { noop: true })
});
