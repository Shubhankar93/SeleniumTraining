package methodOverloading;

public class UsingParameter {
	public void area(int L) {
		System.out.println("Area of Square: " + L*L);
	}
	public void area(int L, int B) {
		System.out.println("Area of Rectangle: " + L*B);
	}
	public void area(float R) {
		System.out.println("Area of Rectangle: " + 22/7*R*R);
	}
	public static void main(String[] args) {
		UsingParameter obj = new UsingParameter();
		obj.area(5);
		obj.area(5, 6);
		obj.area(6.2F);
	}

}


