import numpy as np
from numpy import sin, cos


def calc_quaternion(angle, direction_cosine_angles):
    angle = angle / 2
    w = cos(angle)
    x = sin(angle) * cos(direction_cosine_angles[0])
    y = sin(angle) * cos(direction_cosine_angles[1])
    z = sin(angle) * cos(direction_cosine_angles[2])
    assert abs(w**2 + x**2 + y**2 + z**2 - 1) < 1e-8
    return np.array([round(el, 8) for el in [x, y, z, w]])


print(calc_quaternion(np.pi / 2, [np.pi / 2, 0, np.pi / 2]))
# as alpha increases:
# when axis of rotation is x axis, looking at sun africa, rotate right to left with axis the rotation axis
# when axis of rotation is y axis, looking at sun africa, rotate towards the screen with axis like a rolling pin
# when axis of rotation is z axis, looking at sun africa, rotate clockwise with axis the radius of orbit
