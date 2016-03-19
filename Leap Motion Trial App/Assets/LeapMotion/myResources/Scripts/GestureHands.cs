using UnityEngine;
using System.Collections;
using Leap;

public class GestureHands : MonoBehaviour {
	Controller controller;
	public GameObject block1, block2;
	//public GameObject button;

	// Use this for initialization
	void Start () {
		controller = new Controller ();
		controller.EnableGesture (Gesture.GestureType.TYPESWIPE);
		controller.Config.SetFloat("Gesture.Swipe.MinLength", 200.0f);
		controller.Config.Save ();

	}
	
	// Update is called once per frame
	void Update () {
		Frame frame = controller.Frame ();
		GestureList gestures = frame.Gestures ();
		for (int i = 0; i < gestures.Count; i++) {
			Gesture gesture = gestures [i];
			if (gesture.Type == Gesture.GestureType.TYPESWIPE) {
				SwipeGesture swipe = new SwipeGesture (gesture);
				Vector swipeDirection = swipe.Direction;
				if (swipeDirection.x < 0) {
					Debug.Log ("Left");
					DestroyObject (block1);
				} else {
					if (swipeDirection.x > 0) {
						Debug.Log ("Right");
						DestroyObject (block2);
					}
				}
				//if(button.)
			}

		}
	}
}
