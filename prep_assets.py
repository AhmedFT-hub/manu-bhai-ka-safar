#!/usr/bin/env python3
"""Prepare scene assets: key out painted checker/white backgrounds to true
alpha, auto-crop sprites, downscale heavy props. Outputs to PUBLIC/scene/."""
import os, numpy as np
from PIL import Image
from scipy import ndimage

SRC = os.path.join(os.path.dirname(__file__), "assets-source", "Assets")
OUT = os.path.join(os.path.dirname(__file__), "PUBLIC", "scene")
os.makedirs(OUT, exist_ok=True)


def bg_like(rgb, sat_max=0.15, val_min=0.45):
    """Boolean mask of 'background-like' pixels: low saturation + bright
    (white / gray-checker / pale haze). Excludes dark ink and saturated art."""
    mx = rgb.max(2); mn = rgb.min(2)
    val = mx
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0.0)
    return ((sat < sat_max) & (val > val_min)) | ((sat < 0.40) & (val > 0.80))


def key_background(im, feather=0.8, dilate_bg=1, sat_max=0.15, val_min=0.45, key_all=False):
    """Remove the painted background. By default only background connected to
    the image border is removed (protects low-sat interior art); with key_all
    every background-like pixel is removed, including regions enclosed by the
    subject (e.g. checkerboard between a bicycle's spokes)."""
    rgb = np.asarray(im.convert("RGB"), dtype=np.float32) / 255.0
    h, w, _ = rgb.shape
    cand = bg_like(rgb, sat_max, val_min)
    if key_all:
        bg = cand.copy()
    else:
        # connected components of background-candidate pixels
        lbl, n = ndimage.label(cand)
        # any component touching the border is background
        border_ids = set(np.unique(np.concatenate([
            lbl[0, :], lbl[-1, :], lbl[:, 0], lbl[:, -1]])))
        border_ids.discard(0)
        bg = np.isin(lbl, list(border_ids)) if border_ids else np.zeros_like(cand)
    # Also remove the painted CHECKERBOARD wherever it appears — including regions
    # enclosed by the subject (under a gate arch, between bicycle spokes) that the
    # border flood can't reach. Checkerboard is high-frequency texture; solid
    # interior art (white signs, windows, photo frames) has near-zero local
    # variance, so this leaves it intact.
    gray = rgb.mean(2)
    mean = ndimage.uniform_filter(gray, size=5)
    var = ndimage.uniform_filter(gray * gray, size=5) - mean * mean
    std = np.sqrt(np.maximum(var, 0))
    checker = cand & (std > 0.05)
    checker = ndimage.binary_dilation(checker, iterations=1)
    bg = bg | (checker & cand)
    # eat the anti-aliased halo by growing background a touch into the subject
    if dilate_bg:
        bg = ndimage.binary_dilation(bg, iterations=dilate_bg)
    # despeckle: drop tiny stray opaque blobs (watermark/jpeg specks)
    subj = ~bg
    slbl, sn = ndimage.label(subj)
    if sn:
        areas = ndimage.sum(np.ones_like(slbl), slbl, range(1, sn + 1))
        min_area = max(64, int(0.0002 * h * w))
        keep_ids = [i + 1 for i, a in enumerate(areas) if a >= min_area]
        subj = np.isin(slbl, keep_ids)
        bg = ~subj
    alpha = np.where(bg, 0.0, 255.0).astype(np.float32)
    if feather:
        alpha = ndimage.gaussian_filter(alpha, sigma=feather)
    out = np.dstack([np.asarray(im.convert("RGB")), alpha.astype(np.uint8)])
    return Image.fromarray(out, "RGBA")


def autocrop(im, pad=6):
    a = np.asarray(im)[..., 3]
    ys, xs = np.where(a > 12)
    if len(xs) == 0:
        return im
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, im.width)
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad + 1, im.height)
    return im.crop((x0, y0, x1, y1))


def save(im, name):
    p = os.path.join(OUT, name)
    im.save(p, optimize=True)
    print(f"  -> {name:18s} {im.size}")


def downscale(im, maxw):
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    return im


print("Backgrounds (copy, opaque):")
for src, dst in [("The Sky.png", "sky.png"), ("Far Background.png", "far.png"),
                 ("Mid Background.png", "mid.png"), ("Main Layer.png", "main.png"),
                 ("Groundstrip.png", "ground.png")]:
    save(Image.open(os.path.join(SRC, src)).convert("RGB"), dst)

print("Foreground frame (key ALL bg incl. enclosed checker):")
save(key_background(Image.open(os.path.join(SRC, "Foreground.png")), key_all=True), "fg.png")

print("Boy poses (key + crop):")
for src, dst in [("Child Walking Pose.png", "boy-walk.png"),
                 ("Child Idle Position.png", "boy-idle.png"),
                 ("Child Hand Waving.png", "boy-wave.png"),
                 ("Child Talking.png", "boy-talk.png"),
                 ("Child Front Profile.png", "boy-front.png")]:
    src_im = Image.open(os.path.join(SRC, src))
    save(autocrop(key_background(src_im, sat_max=0.30, val_min=0.35)), dst)

print("Landmarks (key + crop):")
lm = ["Landmark 1 — The Village Gate.png", "Landmark 2 — The Peepal Tree.png",
      "Landmark 3 — The Notice Board.png", "Landmark 4 — The Aanganwadi Building.png",
      "Landmark 5 — The New School.png", "Landmark 6 — The Photo Wall.png",
      "Landmark 7 — The Celebration Chowk.png"]
for i, src in enumerate(lm, 1):
    save(autocrop(key_background(Image.open(os.path.join(SRC, src)))), f"lm{i}.png")

print("Props (downscale, opaque postcards):")
for src, dst in [("Bullock Cart.png", "prop-cart.png"), ("Chai Stall.png", "prop-chai.png"),
                 ("Hand Pump.png", "prop-pump.png"), ("Washing Line.png", "prop-washing.png"),
                 ("Goat.png", "prop-goat.png"), ("Crow on a Wire.png", "prop-crow.png")]:
    save(downscale(Image.open(os.path.join(SRC, src)).convert("RGB"), 1400), dst)

print("Done.")
